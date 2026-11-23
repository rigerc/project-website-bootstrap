#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, mkdtemp, open, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs, promisify } from 'node:util';

const usage = `Usage:
  pnpm media:android screenshot --name NAME [--serial SERIAL] [--package PACKAGE]
  pnpm media:android record --name NAME [--seconds 1-180] [--serial SERIAL] [--package PACKAGE]

Outputs are written under media-output/android/. Recordings default to 20 seconds.`;
const exec = promisify(execFile);
const controller = new AbortController();
const { signal } = controller;

async function adb(args, options = {}) {
  try {
    return (await exec('adb', args, { timeout: 15_000, signal, ...options })).stdout;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('ADB was not found. Install Android SDK Platform Tools and add adb to PATH.');
    }
    if (error.killed) throw new Error(`ADB timed out while running ${args.join(' ')}.`);
    throw new Error(error.stderr?.toString().trim() || error.message);
  }
}

async function selectDevice(requested) {
  const listing = await adb(['devices']);
  const devices = new Map(listing.split('\n').slice(1).flatMap((line) => {
    const [serial, state] = line.trim().split(/\s+/, 2);
    return state ? [[serial, state]] : [];
  }));
  if (requested) {
    const state = devices.get(requested);
    if (state !== 'device') throw new Error(`Device ${requested} is ${state ?? 'not connected'}. Check adb devices.`);
    return requested;
  }
  const connected = [...devices].filter(([, state]) => state === 'device').map(([serial]) => serial);
  if (connected.length === 1) return connected[0];
  if (connected.length > 1) {
    throw new Error(`Multiple Android devices are ready (${connected.join(', ')}). Set --serial or ANDROID_SERIAL.`);
  }
  throw new Error('No Android device is ready. Start an emulator or connect and authorize a device, then check adb devices.');
}

async function assertForeground(device, expected) {
  const windows = await device(['shell', 'dumpsys', 'window', 'displays']);
  const focused = windows.match(/^\s*mCurrentFocus=Window\{[^\n]*?\bu\d+\s+([^/\s}]+)\//m)?.[1];
  if (focused !== expected) {
    throw new Error(`Expected ${expected} in the foreground, found ${focused ?? 'no identifiable app'}.`);
  }
}

async function screenshot(device, target) {
  const png = await device(['exec-out', 'screencap', '-p'], { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });
  const signature = Buffer.from('89504e470d0a1a0a', 'hex');
  const end = Buffer.from('0000000049454e44ae426082', 'hex');
  if (!png.subarray(0, signature.length).equals(signature) || !png.subarray(-end.length).equals(end)) {
    throw new Error('ADB did not return a complete PNG.');
  }
  await writeFile(target, png);
}

// A recording can have an MP4 header even when the encoder never finalized it.
// Inspect the top-level boxes without loading the video or requiring FFmpeg.
async function isCompleteMp4(path) {
  const file = await open(path);
  try {
    const { size } = await file.stat();
    const header = Buffer.alloc(16);
    const required = new Set(['moov', 'mdat']);
    for (let offset = 0; offset < size;) {
      const { bytesRead } = await file.read(header, 0, header.length, offset);
      if (bytesRead < 8) return false;
      const type = header.toString('ascii', 4, 8);
      let length = header.readUInt32BE(0);
      const headerSize = length === 1 ? 16 : 8;
      if (length === 1 && bytesRead < headerSize) return false;
      if (length === 1) length = Number(header.readBigUInt64BE(8));
      if (length === 0) length = size - offset;
      if (length < headerSize || length > size - offset || (offset === 0 && type !== 'ftyp')) return false;
      if (length > headerSize) required.delete(type);
      offset += length;
    }
    return required.size === 0;
  } finally {
    await file.close();
  }
}

async function record(device, target, seconds) {
  const remote = `/data/local/tmp/website-media-${randomUUID()}.mp4`;
  try {
    console.log(`Recording for ${seconds} seconds. Use the app now.`);
    await device(['shell', 'screenrecord', '--time-limit', String(seconds), remote], { timeout: (seconds + 15) * 1000 });
    await device(['pull', remote, target], { timeout: 120_000 });
    if (!await isCompleteMp4(target)) throw new Error('ADB did not return a complete MP4.');
  } finally {
    // Cleanup must still run when the capture command was cancelled.
    await device(['shell', 'rm', '-f', remote], { signal: undefined, timeout: 5_000 }).catch((error) => {
      console.warn(`Could not remove ${remote} from the device: ${error.message}`);
    });
  }
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      name: { type: 'string' },
      serial: { type: 'string' },
      package: { type: 'string' },
      seconds: { type: 'string' },
    },
  });
  if (values.help || process.argv.length === 2) {
    console.log(usage);
    return;
  }

  const [command] = positionals;
  if (positionals.length !== 1 || !['screenshot', 'record'].includes(command)) throw new Error(usage);
  if (!/^[a-z\d][a-z\d_-]{0,79}$/i.test(values.name ?? '')) {
    throw new Error('--name must be 1–80 letters, digits, hyphens or underscores, starting with a letter or digit.');
  }
  const seconds = values.seconds ?? '20';
  if (values.seconds !== undefined && (command !== 'record' || !/^\d{1,3}$/.test(seconds) || +seconds < 1 || +seconds > 180)) {
    throw new Error('--seconds is available for record and must be an integer from 1 to 180.');
  }
  if (values.package !== undefined && !/^[\w]+(?:\.[\w]+)+$/.test(values.package)) {
    throw new Error('--package must be an Android application ID, such as com.example.app.');
  }

  const serial = await selectDevice(values.serial ?? process.env.ANDROID_SERIAL);
  const device = (args, options) => adb(['-s', serial, ...args], options);
  const directory = join('media-output', 'android');
  const filename = `${values.name}.${command === 'record' ? 'mp4' : 'png'}`;
  const output = join(directory, filename);
  await mkdir(directory, { recursive: true });
  const temporary = await mkdtemp(join(directory, '.capture-'));
  try {
    const target = join(temporary, filename);
    if (values.package) await assertForeground(device, values.package);
    if (command === 'screenshot') await screenshot(device, target);
    else await record(device, target, Number(seconds));
    signal.throwIfAborted();
    await rename(target, output);
    console.log(`Generated ${output}`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

const interrupt = () => controller.abort(130);
const terminate = () => controller.abort(143);
process.on('SIGINT', interrupt);
process.on('SIGTERM', terminate);
try {
  await main();
} catch (error) {
  console.error(signal.aborted ? 'Android capture cancelled.' : error.message);
  process.exitCode = signal.aborted ? signal.reason : 1;
} finally {
  process.off('SIGINT', interrupt);
  process.off('SIGTERM', terminate);
}

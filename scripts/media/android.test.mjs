import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./android.mjs', import.meta.url));
const fakeAdb = `#!/usr/bin/env node
const { appendFileSync, writeFileSync } = require('node:fs');
const args = process.argv.slice(2);
appendFileSync('adb.log', JSON.stringify(args) + '\\n');
if (args[0] === 'devices') {
  console.log('List of devices attached');
  console.log(process.env.FAKE_DEVICES);
} else if (args[3] === 'dumpsys') {
  console.log('  mCurrentFocus=Window{123 u0 com.example.app/.MainActivity}');
} else if (args[2] === 'pull') {
  const boxes = '000000096674797000000000096d64617400';
  const movie = process.env.INCOMPLETE === 'yes' ? '' : '000000096d6f6f7600';
  writeFileSync(args[4], Buffer.from(boxes + movie, 'hex'));
}
`;

async function fixture(t) {
  const cwd = await mkdtemp(join(tmpdir(), 'android-media-test-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(join(cwd, 'adb'), fakeAdb, { mode: 0o755 });
  const env = { ...process.env, ANDROID_SERIAL: '', PATH: `${cwd}${delimiter}${process.env.PATH ?? ''}` };
  const run = (args, options = {}) => spawnSync(process.execPath, [script, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...env, FAKE_DEVICES: 'emulator-5554\tdevice', ...options },
  });
  return { cwd, run };
}

test('refuses ambiguous or offline devices and checks the focused app before capturing', async (t) => {
  const { run } = await fixture(t);
  const args = ['screenshot', '--name', 'home'];
  const devices = { FAKE_DEVICES: 'emulator-5554\tdevice\nemulator-5556\tdevice' };
  assert.match(run(args, devices).stderr, /Multiple Android devices/);
  assert.match(run(args, { FAKE_DEVICES: 'emulator-5554\toffline', ANDROID_SERIAL: 'emulator-5554' }).stderr, /is offline/);
  assert.match(run([...args, '--serial', 'emulator-5554', '--package', 'com.example.other'], devices).stderr,
    /Expected com\.example\.other in the foreground, found com\.example\.app/);
});

test('an incomplete recording preserves the earlier file and cleans up both temporary paths', async (t) => {
  const { cwd, run } = await fixture(t);
  const args = ['record', '--name', 'demo', '--seconds', '1'];
  const first = run(args);
  assert.equal(first.status, 0, first.stderr);
  const directory = join(cwd, 'media-output', 'android');
  const output = join(directory, 'demo.mp4');
  const original = await readFile(output);

  const failed = run(args, { INCOMPLETE: 'yes' });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /did not return a complete MP4/);
  assert.deepEqual(await readFile(output), original);
  assert.deepEqual(await readdir(directory), ['demo.mp4']);

  const calls = (await readFile(join(cwd, 'adb.log'), 'utf8')).trim().split('\n').map((line) => JSON.parse(line));
  const recordings = calls.filter((args) => args[3] === 'screenrecord');
  const removals = calls.filter((args) => args[3] === 'rm');
  assert.equal(new Set(recordings.map((args) => args.at(-1))).size, 2);
  assert.deepEqual(removals.map((args) => args.at(-1)), recordings.map((args) => args.at(-1)));
});

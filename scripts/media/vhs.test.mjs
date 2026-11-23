import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve('.');
const tapeFile = join(root, 'scripts/media/tapes/quickstart.tape');

test('VHS tape requests all three formats and a PNG still', async () => {
  const tape = await readFile(tapeFile, 'utf8');
  for (const required of [
    'Output media-output/vhs/quickstart.gif',
    'Output media-output/vhs/quickstart.mp4',
    'Screenshot media-output/vhs/quickstart.png',
  ]) assert.ok(tape.includes(required), `missing VHS command: ${required}`);
  assert.match(tape, /^Type "/m);
  assert.match(tape, /^Enter$/m);
});

test('native runner invokes the checked-in tape', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'vhs-standin-'));
  try {
    const mock = join(folder, 'vhs');
    const log = join(folder, 'args.log');
    await writeFile(mock, '#!/bin/sh\nprintf "%s\\n" "$@" >> "$VHS_MOCK_LOG"\n', { mode: 0o755 });
    const result = spawnSync(process.execPath, ['scripts/media/vhs.mjs', '--native'], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, PATH: `${folder}:${process.env.PATH || ''}`, VHS_MOCK_LOG: log },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const logged = await readFile(log, 'utf8');
    assert.match(logged, /scripts\/media\/tapes\/quickstart\.tape/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

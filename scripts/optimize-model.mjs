// Compress a GLB for the web: Draco geometry, WebP textures capped at 2048px.
//   npm run model:optimize -- <input.glb> [output.glb]
// With no output path the result is written to public/models/<input name>.glb.
import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const [input, output] = process.argv.slice(2);
if (!input) {
  console.error('Usage: npm run model:optimize -- <input.glb> [output.glb]');
  process.exit(1);
}
const out = resolve(output ?? `public/models/${basename(input)}`);
const bin = resolve('node_modules/.bin/gltf-transform') + (process.platform === 'win32' ? '.cmd' : '');
const r = spawnSync(bin, ['optimize', resolve(input), out, '--compress', 'draco', '--texture-compress', 'webp', '--texture-size', '2048'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
if (r.status !== 0) process.exit(r.status ?? 1);
const mb = (f) => (statSync(f).size / 1048576).toFixed(1);
console.log(`\n${basename(input)}: ${mb(input)} MB -> ${mb(out)} MB  (${out})`);
if (statSync(out).size > 10 * 1048576) console.warn('Still over 10 MB: lower the polycount or texture size.');

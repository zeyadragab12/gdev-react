// Prototype 3D generation with Meshy (image -> GLB), then web optimisation.
//   npm run model:generate -- <phase number> [--image path/to/reference.jpg] [--dry-run]
//
// The reference defaults to the phase's region cropped from the master plan image.
// Pass --image to use a render instead (much better results than a top-down plan crop).
// MESHY_API_KEY is read from .env (git-ignored) and is only ever used here, server-side.
// Output: public/models/phase-N.glb. The raw download is kept in .meshy-raw/ (git-ignored).
//
// Results are illustrative concept models, not accurate architectural models.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { PROJECTS } from '../src/data/projects.js';

const API = 'https://api.meshy.ai/openapi/v1/image-to-3d';
const args = process.argv.slice(2);
const num = Number(args.find((a) => /^\d+$/.test(a)));
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const dryRun = args.includes('--dry-run');

const plan = PROJECTS.find((p) => p.key === 'playa').plan;
const phase = plan.phases[num - 1];
if (!phase) {
  console.error(`Usage: npm run model:generate -- <1-${plan.phases.length}> [--image file] [--dry-run]`);
  process.exit(1);
}

// reference image: explicit file, or the phase region (+6% padding) cropped from the plan
async function reference() {
  const file = flag('--image');
  const input = file ? resolve(file) : resolve('public', plan.image.replace(/^\//, ''));
  let img = sharp(input);
  if (!file) {
    const [x, y, w, h] = phase.region;
    const padX = Math.round(w * 0.06);
    const padY = Math.round(h * 0.06);
    const left = Math.max(0, x - padX);
    const top = Math.max(0, y - padY);
    img = img.extract({
      left,
      top,
      width: Math.min(plan.width - left, w + 2 * padX),
      height: Math.min(plan.height - top, h + 2 * padY),
    });
  }
  return img.resize({ width: 1536, height: 1536, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
}

const buf = await reference();
console.log(`Phase ${num} (${phase.title}): reference ${(buf.length / 1024).toFixed(0)} KB`);
mkdirSync('.meshy-raw', { recursive: true });
writeFileSync(`.meshy-raw/phase-${num}-reference.jpg`, buf);
if (dryRun) {
  console.log(`Dry run: reference saved to .meshy-raw/phase-${num}-reference.jpg, nothing sent.`);
  process.exit(0);
}

const key = process.env.MESHY_API_KEY;
if (!key) {
  console.error('MESHY_API_KEY is not set. Put it in .env (see .env.example) and run through npm so it is loaded.');
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

const create = await fetch(API, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    image_url: `data:image/jpeg;base64,${buf.toString('base64')}`,
    ai_model: 'meshy-6',
    topology: 'triangle',
    target_polycount: 40000,
    should_texture: true,
    enable_pbr: false,
  }),
});
const created = await create.json();
if (!create.ok) {
  console.error('Meshy rejected the request:', create.status, JSON.stringify(created));
  process.exit(1);
}
const id = created.result;
console.log(`Task ${id} started. Waiting (usually a few minutes)...`);

let task;
for (;;) {
  await new Promise((r) => setTimeout(r, 6000));
  task = await (await fetch(`${API}/${id}`, { headers })).json();
  process.stdout.write(`\r${task.status} ${task.progress ?? 0}%   `);
  if (['SUCCEEDED', 'FAILED', 'CANCELED'].includes(task.status)) break;
}
console.log();
if (task.status !== 'SUCCEEDED' || !task.model_urls?.glb) {
  console.error('Generation did not succeed:', JSON.stringify(task.task_error ?? task));
  process.exit(1);
}

const raw = `.meshy-raw/phase-${num}.glb`;
writeFileSync(raw, Buffer.from(await (await fetch(task.model_urls.glb)).arrayBuffer()));
console.log(`Downloaded ${raw}. Optimising...`);
const r = spawnSync(process.execPath, ['scripts/optimize-model.mjs', raw, `public/models/phase-${num}.glb`], { stdio: 'inherit' });
process.exit(r.status ?? 0);

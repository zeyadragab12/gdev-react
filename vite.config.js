import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// DEV ONLY (apply: 'serve'): lets the master-plan editor (/dev/masterplan-editor) save the
// cropped images it makes into public/images/phases. Not part of any build.
function devImageUpload() {
  const dir = resolve('public/images/phases');
  return {
    name: 'dev-image-upload',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/upload', (req, res) => {
        const name = new URL(req.url, 'http://x').searchParams.get('name') ?? '';
        const send = (code, body) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (req.method !== 'POST') return send(405, { error: 'POST only' });
        if (!/^[a-z0-9][a-z0-9-]*\.(jpg|webp|png)$/.test(name)) return send(400, { error: 'bad file name' });
        const chunks = [];
        let size = 0;
        req.on('data', (c) => {
          size += c.length;
          if (size > 15 * 1048576) req.destroy();
          else chunks.push(c);
        });
        req.on('end', () => {
          mkdirSync(dir, { recursive: true });
          writeFileSync(resolve(dir, name), Buffer.concat(chunks));
          send(200, { path: `/images/phases/${name}` });
        });
        req.on('error', () => send(500, { error: 'upload failed' }));
      });
    },
  };
}

// DEV ONLY (apply: 'serve'): lets the project editor (/dev/projects) and the master-plan editor
// save their edits to src/data/overrides/<project-key>.json, which src/data/projects.js merges
// over the code defaults. POST merges the body into the file (objects deep-merged, arrays and
// values replaced); DELETE removes the file, restoring the code defaults.
function devProjectSave() {
  const dir = resolve('src/data/overrides');
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (a, b) => {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) out[k] = isObj(v) && isObj(a?.[k]) ? merge(a[k], v) : v;
    return out;
  };
  return {
    name: 'dev-project-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/save-project', (req, res) => {
        const key = new URL(req.url, 'http://x').searchParams.get('key') ?? '';
        const send = (code, body) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) return send(400, { error: 'bad project key' });
        const file = resolve(dir, `${key}.json`);
        if (req.method === 'DELETE') {
          rmSync(file, { force: true });
          return send(200, { ok: true });
        }
        if (req.method !== 'POST') return send(405, { error: 'POST or DELETE only' });
        const chunks = [];
        let size = 0;
        req.on('data', (c) => {
          size += c.length;
          if (size > 2 * 1048576) req.destroy();
          else chunks.push(c);
        });
        req.on('end', () => {
          try {
            const patch = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            if (!isObj(patch)) return send(400, { error: 'body must be a JSON object' });
            const current = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
            mkdirSync(dir, { recursive: true });
            writeFileSync(file, `${JSON.stringify(merge(current, patch), null, 2)}
`);
            send(200, { ok: true });
          } catch (e) {
            send(400, { error: String(e.message ?? e) });
          }
        });
        req.on('error', () => send(500, { error: 'save failed' }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devImageUpload(), devProjectSave()],
});

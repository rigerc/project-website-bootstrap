import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

const roots = ['dist', '.vercel/output/static'];
const routes = ['index.html', 'docs/index.html', 'docs/getting-started/index.html', 'docs/media/index.html'];
async function exists(path) { try { await access(path); return true; } catch { return false; } }
const root = (await Promise.all(roots.map(async root => ({ root, ok: await exists(resolve(root,'index.html')) })))).find(x=>x.ok)?.root;
if (!root) throw new Error('No built landing page found. Run pnpm build first.');
for (const route of routes) {
  if (!(await exists(resolve(root, route)))) throw new Error(`Missing route: ${root}/${route}`);
  console.log(`OK: /${route}`);
}
for (const obsolete of ['blog/index.html','projects/index.html','services/index.html','about/index.html','contact/index.html']) {
  if (await exists(resolve(root,obsolete))) throw new Error(`Obsolete demo route still exists: ${obsolete}`);
}
console.log('Single-project routes verified.');

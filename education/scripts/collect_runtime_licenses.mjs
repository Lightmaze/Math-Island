import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
const sections = ['Third-party runtime software distributed with MathCups Island Education.\nIndividual license terms remain applicable.\n'];
let count = 0;
for (const [path, metadata] of Object.entries(lock.packages)) {
  if (!path || metadata.dev || !path.includes('node_modules/')) continue;
  const folder = join(root, path);
  const pkg = JSON.parse(await readFile(join(folder, 'package.json'), 'utf8'));
  let license;
  for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT', 'LICENCE', 'license']) {
    try { await access(join(folder, name)); license = await readFile(join(folder, name), 'utf8'); break; } catch { /* Try the next upstream spelling. */ }
  }
  if (!license) throw new Error(`No upstream license file found for ${pkg.name}@${pkg.version}`);
  sections.push(`${pkg.name}@${pkg.version}\nPackage: https://www.npmjs.com/package/${pkg.name}\nDeclared license: ${pkg.license || metadata.license || 'See text below'}\n\n${license.trim()}\n`);
  count++;
}
await mkdir(join(root, 'public/licenses'), {recursive:true});
await writeFile(join(root, 'public/licenses/npm-runtime-notices.txt'), sections.join('\n\n————————————————————————————————————————\n\n'));
console.log(`Preserved original license notices for ${count} runtime packages.`);

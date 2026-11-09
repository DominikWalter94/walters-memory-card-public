import { writeFile, rename } from 'node:fs/promises';
export const SOURCE = 'https://retro-sbirka-dominik.pracovn-pros-2583.chatgpt.site/collection.json';
const fields = ['title','platform','status','edition','manual','condition','estimatedValue','completeness'];
export function sanitize(data) {
  if (data?.schemaVersion !== 1 || data.currency !== 'CZK' || !Array.isArray(data.games)) throw Error('Unexpected collection schema');
  const games = data.games.map(g => {
    if (!g || typeof g.title !== 'string' || !g.title.trim() || !['PS1','PS2'].includes(g.platform) || !['owned','wanted'].includes(g.status)) throw Error('Invalid game');
    for (const key of ['edition','condition','completeness']) if (g[key] != null && typeof g[key] !== 'string') throw Error('Invalid text field');
    if (g.manual != null && typeof g.manual !== 'boolean') throw Error('Invalid manual');
    if (g.estimatedValue != null && (typeof g.estimatedValue !== 'number' || !Number.isFinite(g.estimatedValue) || g.estimatedValue < 0)) throw Error('Invalid value');
    return Object.fromEntries(fields.map(k => [k, g[k] ?? null]));
  });
  games.sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b),'en'));
  return {schemaVersion:1,currency:'CZK',games};
}
export async function synchronize() {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(SOURCE, {redirect:'error',credentials:'omit',headers:{Accept:'application/json'},signal:AbortSignal.timeout(30000)});
      if (r.status !== 200 || !r.headers.get('content-type')?.includes('application/json')) throw Error('Source not HTTP 200 JSON');
      const text = await r.text();
      if (text.length > 2000000) throw Error('Response too large');
      const output = sanitize(JSON.parse(text));
      await writeFile('collection.json.tmp', JSON.stringify(output,null,2)+'\n');
      await rename('collection.json.tmp','collection.json');
      // Daily audit record of successful source validation, independent of game changes.
      await writeFile('sync-status.json',JSON.stringify({lastVerifiedDateUTC:new Date().toISOString().slice(0,10),source:SOURCE,gameCount:output.games.length},null,2)+'\n');
      console.log('Validated and synchronized '+output.games.length+' games');
      return;
    } catch (e) {lastError=e; if(attempt<2) await new Promise(r=>setTimeout(r,5000*(attempt+1)));}
  }
  throw lastError;
}
if (process.argv[1]?.endsWith('sync.mjs')) await synchronize();

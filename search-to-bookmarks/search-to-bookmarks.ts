// Search DuckDuckGo for the query in input.txt, save each result as a .url bookmark in a new
// folder next to this script, and open a Markdown summary.
//
// Grants name exact paths. Nothing beside the script is readable or writable unless it is listed
// here, and a bare "." is rejected — bookmarks go in a fixed `results/` folder precisely so the
// grant can be a name rather than "my whole directory".
// @permissions browser net=duckduckgo.com read=input.txt write=output.md,results

import { context, files, tabs, ui } from "tranquil/automation";
import { parse } from "jsr:@std/dotenv/parse";
import { delay } from "jsr:@std/async@1/delay";
import { join } from "jsr:@std/path@1";
import { slugify } from "jsr:@std/text@1/unstable-slugify";

// 1. Read + parse input.txt (sibling). Missing file or query → error popup.
let inputs: Record<string, string>;
try {
  inputs = parse(files.read("input.txt"));
} catch {
  await ui.notify('Missing "input.txt" next to the script — add e.g.  query=business automation', {
    level: "error",
  });
  Deno.exit(1);
}
const term = (inputs.query ?? "").trim();

if (!term) {
  await ui.notify('input.txt needs a "query=" line, e.g.  query=business automation', {
    level: "error",
  });
  Deno.exit(1);
}

const ac = await fetch("https://duckduckgo.com/ac/?q=" + encodeURIComponent(term));
await ui.notify(`Autocomplete: ${(await ac.json())[0]?.phrase ?? "none"}`);

const count = Math.min(Math.max(Number(inputs.count) || 10, 1), 25);

// 2. Search.
await ui.notify(`▶ Searching DuckDuckGo for "${term}"…`);
const tab = await tabs.active();
await tab.goto("https://duckduckgo.com/?q=" + encodeURIComponent(term), { waitUntil: "load" });
await tab.waitFor('a[data-testid="result-title-a"]', { timeout: 15000 });

// 3. Load more, then scrape the top `count` real results (ads skipped, query strings stripped).
await ui.notify(`Collecting top ${count} results…`);
await tab.evaluate(() => {
  const more = document.querySelector("#more-results") as HTMLButtonElement | null;
  more?.click();
});
await delay(1500);
const results = await tab.evaluate<{ title: string; url: string }[]>((n: number) => {
  const out: { title: string; url: string }[] = [];
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a[data-testid="result-title-a"]')) {
    const u = new URL(a.href);
    if (u.hostname.endsWith("duckduckgo.com")) continue; // skip DDG ad/tracker links (y.js, etc.)
    out.push({ title: (a.textContent || "").trim(), url: u.origin + u.pathname }); // strip ?query#hash
    if (out.length >= n) break;
  }
  return out;
}, count);

// 4. Save each result as a .url bookmark under results/<query>/ next to this script.
await ui.notify(`Saving ${results.length} bookmarks…`);
const folder = join("results", slugify(term));
const dir = join(context.scriptDir, folder);
// Deno.mkdirSync, not @std/fs ensureDirSync: that one stats the path first, which needs READ
// on the folder as well as write. recursive:true is already idempotent, so the stat bought
// nothing except a wider grant.
Deno.mkdirSync(dir, { recursive: true });
results.forEach((r, i) => {
  const name = `${String(i + 1).padStart(2, "0")}-${slugify(r.title) || "result"}.url`;
  Deno.writeTextFileSync(join(dir, name), `[InternetShortcut]\nURL=${r.url}\n`);
});

// 5. Write a Markdown summary to output.md, reveal it, and signal done.
const summary = [
  `# Search results: ${term}`,
  "",
  `_${results.length} result${results.length === 1 ? "" : "s"} · saved to \`${folder}/\`_`,
  "",
  ...results.map((r, i) => `${i + 1}. [${r.title}](${r.url})`),
  "",
].join("\n");
await ui.open(files.write("output.md", summary));
await ui.notify(`■ Done — ${results.length} results → ${folder}/`, { level: "success" });

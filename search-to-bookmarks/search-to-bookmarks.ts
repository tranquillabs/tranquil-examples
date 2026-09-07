// Search DuckDuckGo for the query in input.txt, save each result as a .url bookmark in a new
// folder next to this script, and open a Markdown summary.
//
// Grants name exact paths. Nothing beside the script is readable or writable unless it is listed
// here, and a bare "." is rejected — bookmarks go in a fixed `results/` folder precisely so the
// grant can be a name rather than "my whole directory".
// @permissions browser net=duckduckgo.com read=input.txt write=output.md,results

import { context, files, tabs, ui } from "tranquil/automation";
import { parse } from "jsr:@std/dotenv@0.225/parse";
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
const RESULT = 'a[data-testid="result-title-a"]';
await ui.notify(`▶ Searching DuckDuckGo for "${term}"…`);
const tab = await tabs.active();
await tab.goto("https://duckduckgo.com/?q=" + encodeURIComponent(term), { waitUntil: "load" });
await tab.waitFor(RESULT, { timeout: 15000 });

// 3. Load more, then scrape the top `count` real results (ads skipped, query strings stripped).
await ui.notify(`Collecting top ${count} results…`);

// Only ask for a second page if the first didn't already cover `count`. Tag the results
// that are on screen before clicking, so the wait afterwards can be an ordinary selector:
// "a result that wasn't here a moment ago". waitFor's predicate runs inside the page and
// takes no arguments, so marking the DOM is how you carry a baseline across that boundary.
const askedForMore = await tab.evaluate<boolean>(
  (n: number, sel: string) => {
    const found = document.querySelectorAll(sel);
    if (found.length >= n) return false;
    found.forEach((a) => a.setAttribute("data-tq-seen", ""));
    document.querySelector<HTMLButtonElement>("#more-results")?.click();
    return true;
  },
  count,
  RESULT,
);

if (askedForMore) {
  // Wait for the results themselves, never a fixed sleep. A guessed delay is wrong in both
  // directions: too short on a slow connection — where the scrape below quietly returns
  // only the first page — and wasted time on every fast run.
  try {
    await tab.waitFor(`${RESULT}:not([data-tq-seen])`, { timeout: 10000 });
  } catch {
    // Nothing more arrived: the last page of results, or DuckDuckGo moved the button.
    // Carry on with what the first page gave us rather than failing the run.
  }
}

const results = await tab.evaluate<{ title: string; url: string }[]>(
  (n: number, sel: string) => {
    const out: { title: string; url: string }[] = [];
    for (const a of document.querySelectorAll<HTMLAnchorElement>(sel)) {
      const u = new URL(a.href);
      if (u.hostname.endsWith("duckduckgo.com")) continue; // skip DDG ad/tracker links (y.js, etc.)
      out.push({ title: (a.textContent || "").trim(), url: u.origin + u.pathname }); // strip ?query#hash
      if (out.length >= n) break;
    }
    return out;
  },
  count,
  RESULT,
);

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

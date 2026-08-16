// Multi-URL fan-out: visit several pages in background tabs (up to 3 at once), collect their
// titles, and open the result as a TSV in the editor.
//
// `await using` auto-closes each tab when the block finishes — no leaked tabs in loops.
// The sequential sibling — the same crawl reusing ONE visible tab — is:
//
//   const tab = await tabs.active();
//   for (const url of urls) {
//     await tab.goto(url);
//     rows.push(`${await tab.title()}\t${url}`);
//   }
// @permissions browser
import { pooledMap } from "jsr:@std/async@1/pool";
import { files, tabs, ui } from "tranquil/automation";

const urls = [
  "https://example.com/",
  "https://example.org/",
  "https://example.net/",
];

const rows = pooledMap(3, urls, async (url) => {
  await using tab = await tabs.open(url, { background: true });
  await tab.waitFor("h1");
  return `${await tab.title()}\t${url}`;
});

await ui.open(files.write("titles.tsv", (await Array.fromAsync(rows)).join("\n")));

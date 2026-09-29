# fetch-titles

Visits several URLs in background tabs, collects each page's title, and opens the results as a TSV
in the editor. The output file lands in this folder, next to the script.

This is the fan-out example, and the one worth reading rather than just running:

- **`pooledMap(3, …)`** runs at most three tabs at a time. Unbounded `Promise.all` over a long URL
  list would open a tab per URL at once.
- **`await using tab = …`** closes each tab when its block finishes, including on error. Without it,
  a crawl that throws halfway leaves its tabs open.
- **`tab.waitFor("h1")`** waits for content rather than guessing with a sleep.

The script's header comment shows the sequential alternative — the same crawl through one visible
tab — which is easier to watch and easier to debug.

Open a page in a browser tab, focus `fetch-titles.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions browser`, so the first run asks for approval once.
See the [Writing Automations guide](https://www.tranquillabs.dev/docs/writing-automations/).

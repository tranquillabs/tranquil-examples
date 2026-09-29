# tranquil-examples

Runnable examples for [Tranquil](https://www.tranquillabs.dev). Each folder is one self-contained
example — the script, a short README, and anything it writes.

## Use them

```sh
git clone https://github.com/tranquillabs/tranquil-examples.git
```

Open the folder in Tranquil (**File → Open**), open any web page in a browser tab, then focus a
`.ts` file and press `Cmd-Shift-R`.

Each automation declares the permissions it needs in a comment header, so the first run of each asks
for approval once.

> Clone this somewhere standalone rather than inside an existing Deno project. A `deno.json` in a
> parent directory takes precedence over the import map Tranquil maintains, and the
> `tranquil/automation` import will not resolve. See
> [Where automations live](https://www.tranquillabs.dev/docs/writing-automations/).

## The examples

| Example | What it does | What it teaches |
| --- | --- | --- |
| [`count-elements/`](./count-elements) | Counts matching elements on the page and notifies | Seven lines — start here |
| [`page-info/`](./page-info) | Scrapes page stats and opens the result | Writing a file: it lands next to the script, so the example and its output travel together |
| [`highlight-links/`](./highlight-links) | Outlines every external link | Changing a live page from `tab.evaluate` |
| [`page-banner/`](./page-banner) | Adds and removes a banner | A toggle you can re-run — it checks for its own element first |
| [`reader-mode/`](./reader-mode) | Hides clutter and widens the main column | Restyling a page you don't control |
| [`measure-and-place/`](./measure-and-place) | Labels every image with its rendered size | Measuring a page and then changing it. `evaluate` runs on the page's own main thread, so batch every read before the first write — otherwise each measurement forces a fresh layout |
| [`fetch-titles/`](./fetch-titles) | Visits several pages at once and collects their titles | The multi-tab patterns: bounded concurrency with `pooledMap`, and `await using` so tabs close even when a crawl throws |
| [`slow-count/`](./slow-count) | Counts slowly — a run long enough to try **Cancel** on | Passing `context.signal` to whatever you wait on, so Cancel stops the script within a second instead of at the next step boundary |
| [`search-to-bookmarks/`](./search-to-bookmarks) | Searches the web, saves each result as a `.url`, writes a summary | The fullest one: file input, a `fetch`, scraping, and file output in a single script |
| [`spice-catalogue/`](./spice-catalogue) | Maintains a `spices.json` across runs — create, read, update, delete | The only one that edits a file it already owns. Run it twice and the second run finds nothing to do |
| [`files-example/`](./files-example) | Sample files covering the common desktop types — text, Markdown, PDF, an image, data, code, a bookmark | How the tree view represents different file types, and what actually happens when you open each one |

## Learning Tranquil

This repo is examples only. The guides — the editor, the browser, writing and running automations,
and the permissions model — live at
**[tranquillabs.dev/docs](https://www.tranquillabs.dev/docs/)**.

All content here is generic and invented; there is no real data in it.

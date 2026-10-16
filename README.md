# tranquil-examples

Runnable examples for [Tranquil](https://www.tranquillabs.dev). Each folder is one self-contained
example: the script, a short README, and anything it writes. Each also has a page in the
[docs](https://www.tranquillabs.dev/docs/examples/).

## Use them

```sh
git clone https://github.com/tranquillabs/tranquil-examples.git
```

Open the folder in Tranquil (**File → Open**), open any web page in a browser tab, then focus a
`.ts` file and press `Cmd-Shift-R`.

Each automation is one standalone script. A Deno script declares everything it needs in the script
itself: its dependencies as imports, and what it may do in a comment header at the top (the first
run of each asks you to approve that header once). So there is no `deno.json` or other file to set
up: Tranquil supplies the rest. Each script's first line points at the rules Tranquil keeps for
LLMs that write or change automations, `~/.tranquil/llm/writing-automations.md`. See
[One import, no build setup](https://www.tranquillabs.dev/docs/sdk/#one-import-no-build-setup).

## The examples

Each row links the folder and its page in the docs, which walks through the script.

| Example | What it does | What it teaches |
| --- | --- | --- |
| [`count-elements/`](./count-elements) ([docs](https://www.tranquillabs.dev/docs/example-count-elements/)) | Counts the paragraphs on the page and notifies | Eight lines: start here |
| [`page-info/`](./page-info) ([docs](https://www.tranquillabs.dev/docs/example-page-info/)) | Scrapes page stats and opens the result | Writing a file: it lands next to the script, so the example and its output travel together |
| [`highlight-links/`](./highlight-links) ([docs](https://www.tranquillabs.dev/docs/example-highlight-links/)) | Outlines every external link | Changing a live page from `tab.evaluate` |
| [`page-banner/`](./page-banner) ([docs](https://www.tranquillabs.dev/docs/example-page-banner/)) | Adds and removes a banner | A toggle you can re-run: it checks for its own element first |
| [`reader-mode/`](./reader-mode) ([docs](https://www.tranquillabs.dev/docs/example-reader-mode/)) | Hides clutter and widens the main column | Restyling a page you don't control |
| [`measure-and-place/`](./measure-and-place) ([docs](https://www.tranquillabs.dev/docs/example-measure-and-place/)) | Labels every image with its rendered size | Measuring a page and then changing it: batch every read before the first write |
| [`fetch-titles/`](./fetch-titles) ([docs](https://www.tranquillabs.dev/docs/example-fetch-titles/)) | Visits several pages at once and collects their titles | Bounded concurrency with `pooledMap`, and `await using` so tabs close even when a crawl throws |
| [`slow-count/`](./slow-count) ([docs](https://www.tranquillabs.dev/docs/example-slow-count/)) | Counts slowly: a run long enough to try **Cancel** on | Passing `context.signal` to whatever you wait on, so Cancel stops the script within a second |
| [`search-to-bookmarks/`](./search-to-bookmarks) ([docs](https://www.tranquillabs.dev/docs/example-search-to-bookmarks/)) | Searches the web, saves each result as a `.url`, writes a summary | The fullest one: file input, a `fetch`, scraping, and file output in a single script |
| [`spice-catalogue/`](./spice-catalogue) ([docs](https://www.tranquillabs.dev/docs/example-spice-catalogue/)) | Maintains a `spices.json` across runs: create, read, update, delete | The only one that edits a file it already owns |
| [`files-example/`](./files-example) ([docs](https://www.tranquillabs.dev/docs/example-files/)) | Sample files of the common desktop types: text, Markdown, PDF, an image, data, code, a bookmark | How the tree view represents different file types, and what happens when you open each |

## Learning Tranquil

This repo is examples only. The guides (the editor, the browser, writing and running automations,
and the automation SDK) live at
**[tranquillabs.dev/docs](https://www.tranquillabs.dev/docs/)**.

All content here is generic and invented; there is no real data in it.

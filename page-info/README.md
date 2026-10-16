# page-info

Scrapes the active page's title plus its link, image, and heading counts, writes them to
`page-info.txt` in this folder, and opens the file in the editor.

Open a page in a browser tab, focus `page-info.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions page-js write=page-info.txt`, to read the page and write the one file,
so the first run asks for approval once.
See [this example in the docs](https://www.tranquillabs.dev/docs/example-page-info/).

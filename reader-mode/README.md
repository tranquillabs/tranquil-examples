# reader-mode

A rough reader mode: hides headers, footers, sidebars, and navigation, then widens and
re-types the main column. Reload the page to undo it.

Open a page in a browser tab, focus `reader-mode.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions page-js`, because it restyles the page, so the first run asks for
approval once.
See [this example in the docs](https://www.tranquillabs.dev/docs/example-reader-mode/).

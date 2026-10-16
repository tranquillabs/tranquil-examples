# page-banner

Toggles a small banner at the top of the active page. Run it once to add the banner, again to
remove it. The script checks for its own element first, which is the general pattern for an
automation you run repeatedly against the same page.

Open a page in a browser tab, focus `page-banner.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions page-js`, because it changes the page, so the first run asks for
approval once.
See [this example in the docs](https://www.tranquillabs.dev/docs/example-page-banner/).

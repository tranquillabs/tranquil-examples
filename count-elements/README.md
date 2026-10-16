# count-elements

Counts how many paragraphs (or any tag you choose) are on the active page and shows the total as a notification.

Edit the selector in `querySelectorAll("p")` to count something else.

Open a page in a browser tab, focus `count-elements.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions page-js`, because counting runs in the page, so the first run asks for
approval once.
See [this example in the docs](https://www.tranquillabs.dev/docs/example-count-elements/).

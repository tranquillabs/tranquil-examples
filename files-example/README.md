# files-example

Not an automation — a set of sample files. Tranquil is a code editor first, so it treats most file
types the same way (a text editor, with syntax highlighting where it recognizes the extension), and
a few specially. Browse the tree view here to see both: the icon next to each file, and what
actually happens when you open it.

| File | Type | What happens when you open it |
| --- | --- | --- |
| `sample.txt` | Plain text | Opens directly in the text editor |
| `sample.md` | Markdown | Opens as text (Markdown highlighting) — Toggle Markdown Preview to render it |
| `sample.pdf` | PDF | Opens in a PDF preview pane, not as text |
| `sample.png` | Image | Opens in an image preview pane, not as text |
| `sample.csv` | Spreadsheet data | Opens as plain text — no grid/spreadsheet view |
| `sample.json` | Structured data | Opens as text with JSON syntax highlighting |
| `sample.xml` | Structured data | Opens as text with XML syntax highlighting |
| `sample.ts` | Code | Opens as text with TypeScript syntax highlighting. This one is *not* a runnable automation like the `.ts` files elsewhere in this repo — just a plain sample |
| `sample.py` | Code | Opens as text with Python syntax highlighting |
| `Example.url` | Bookmark | Opens as a Tranquil browser tab, not a text editor |

Audio and video files aren't included — Tranquil has no built-in player, so they'd just show up as
unreadable binary content in a text editor.

To make your own bookmark, open a page and press `Cmd-Shift-A`. See the
[Browser & Tabs guide](https://www.tranquillabs.dev/docs/guides/studio/browser/).

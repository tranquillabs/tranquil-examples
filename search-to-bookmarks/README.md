# search-to-bookmarks

Searches DuckDuckGo for a query you put in `input.txt`, saves each result as a `.url` bookmark under
`results/<query>/` beside the script, and opens a Markdown summary in the editor.

The most complete example here — it touches nearly every part of the API in one run:

- **Input from a file.** `files.read("input.txt")` parsed with `@std/dotenv`, because a script has
  no stdin and no prompt. Edit `input.txt` to change what it searches for.
- **A plain `fetch`** to DuckDuckGo's autocomplete endpoint, from the script rather than the page.
- **Driving a tab** — `goto`, `waitFor`, and two `evaluate` calls, one to click "More results" and
  one to scrape.
- **Writing files** next to the script, including a folder it creates.
- **Progress you can watch** via `ui.notify`, which pops a notification and logs the same line to
  the Automation Runs panel.

## Run it

1. Edit `input.txt`:
   ```
   query=business automation
   count=10
   ```
   `count` is clamped to 1–25.
2. Open a browser tab on any page, focus `search-to-bookmarks.ts`, and press `Cmd-Shift-R`.

It navigates the **active tab**, so it will take over whatever page you have open.

## Permissions

```ts
// @permissions browser net=duckduckgo.com read=input.txt write=output.md,results
```

`browser` to drive the tab, and `net` for the autocomplete request — that one runs in the script's
own sandbox, so it needs a network grant even though the page it later visits does not.

The file grants name exact paths. Nothing beside the script is readable or writable unless it is
listed, and a bare `.` is rejected — path grants are recursive, so `.` would mean the whole folder.
That is why bookmarks go in a fixed `results/` folder: the query-derived name changes every run, so
the *parent* is what gets granted, and `write=results` covers it and everything it creates inside.

Everything it writes — `output.md` and `results/` — is left visible rather than git-ignored, so
the bookmarks show up in the tree where you can double-click them. Running the example makes
your clone dirty; that is the output, not noise.

Scraping is against a live site, so the selectors (`a[data-testid="result-title-a"]`,
`#more-results`) will need updating whenever DuckDuckGo changes its markup.

See the [Writing Automations guide](https://www.tranquillabs.dev/docs/writing-automations/).

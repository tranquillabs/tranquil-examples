# 02 · Browser & Tabs

Tranquil has a **real, full Chromium browser** built in — not a preview pane. It opens as a
tab right next to your code. This matters because in the next lessons your automations will
drive it.

## Open a browser tab

- **`Cmd-T`** — open a new browser tab (it splits into a pane beside your editor).
- Type a web address in the URL bar and press **Enter**. Not a URL? It searches instead.

**Try it:** press `Cmd-T`, type `example.com`, and press Enter.

Prefer to open a page from the tree? This project ships a **`.url` shortcut** you can
double-click to open as a browser tab:

- **`Tabs/Example.url`** — a tiny, dependable page, used throughout the automation lessons.

## Get around a page

- **Back / Forward:** `Alt-←` / `Alt-→`, or the toolbar arrows.
- **Reload:** `Cmd-R`. Hard reload (bypass cache): `Cmd-Shift-R`.
- **Focus the URL bar:** `Cmd-L`.

## Find on the page

- **`Cmd-F`** — open find-in-page. It appears in the right dock and highlights matches live.
- **`Cmd-G`** / **`Cmd-Shift-G`** — jump to the next / previous match.

**Try it:** open `Tabs/Example.url`, press `Cmd-F`, and search for a word on the page.

## Bookmark a page as a `.url` file

Tranquil bookmarks are just files in your project, so they live with your work:

- **`Cmd-Shift-A`** — save the current page as a `.url` file in the tree.
- Double-click any `.url` later to reopen it. Right-click a folder for **"Open all URLs…"**
  to open a whole set at once.

## One session per window

Every tab in a window shares that window's login session. Need to be signed in as two
different accounts on the same site? Right-click a link or tab and choose **"Open in new
window"** — the new window has its own separate session (see lesson 1).

---

📖 **Learn more:** [Browser & Tabs](https://tranquil.tools/docs/latest/getting-started/browser/)
on the web.

**Next:** open **[03 · Run Automations](./03-Run-Automations.md)** → to make a page do your
bidding.

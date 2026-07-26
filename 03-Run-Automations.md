# 03 · Run Automations

An **automation** in Tranquil is a small `.js` file that controls a browser tab. This project
ships a few ready to run in `Automations/browser/`. Let's run them.

## The idea: three moves

Almost every browser automation is the same three moves:

```js
const tab = await tranquil.getActiveTab();          // 1. grab the current browser tab
const n = await tab.evaluate(() => {                // 2. run code *inside* the page
  return document.querySelectorAll('img').length;
});
tranquil.notify(`This page has ${n} image(s).`);    // 3. report back
```

Keep move #2 in mind: code inside `tab.evaluate(() => { … })` runs **in the web page** (that's
where `document` and `window` live). Everything outside it runs in Tranquil.

## Run one

1. **Open a browser tab** on any page — double-click **`Tabs/Example.url`** (from lesson 2).
2. **Open an automation:** in the tree, open `Automations/browser/page-banner.js`. It should
   be the active tab in the editor.
3. **Run it:** press **`Cmd-Shift-R`**.

A banner — *"This page was enhanced by a Tranquil automation."* — appears at the top of the
page. Run it again to toggle it off.

## Try the others

With a browser tab open, open each of these and press `Cmd-Shift-R`:

- **`page-info.js`** — reads the page's link/image/heading counts and opens a report as a new
  text file in the editor.
- **`count-elements.js`** — pops a notification with the number of images on the page.
- **`highlight-links.js`** — outlines every external link in orange.
- **`reader-mode.js`** — hides clutter (headers, nav, footers) and widens the main column.

## Two things that trip people up

- **Run with the automation file focused — not the browser tab.** Tranquil remembers the
  *last browser tab you looked at* and targets that. So: click the page to load it, then
  click back into the `.js` file and press `Cmd-Shift-R`. (From a focused browser tab,
  `Cmd-Shift-R` is the browser's *hard reload* instead.)
- **Put page code inside `tab.evaluate()`.** The outer script can't see the page's `document`
  directly — only the function you pass to `evaluate` runs in the page.

> **Tip:** select just a few lines and press `Cmd-Shift-R` to run **only the selection** — a
> quick way to experiment, like a REPL. You'll use this in the next lesson.

---

📖 **Learn more:** [Running Automations](https://tranquil.tools/docs/latest/getting-started/automations/)
on the web.

**Next:** open **[04 · Your First Automation](./04-Your-First-Automation.md)** → and write
your own.

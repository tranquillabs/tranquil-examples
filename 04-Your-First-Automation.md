# 04 · Your First Automation

Time to write your own — it's about six lines. You'll make an automation that counts the
paragraphs on a page and reports the number, then save it as a reusable command.

## 1. Create the file

In the tree, right-click the **`Automations/browser/`** folder → **New File** → name it
`my-first.ts`. It opens in the editor.

## 2. Write the three moves

Type this in (or paste it):

```ts
// My first automation: count the paragraphs on the page.
import { tabs, ui } from "tranquil/automation";

const tab = await tabs.active();
const count = await tab.evaluate(() => {
  return document.querySelectorAll("p").length;
});
await ui.notify(`This page has ${count} paragraph(s).`, { level: "success" });
```

Remember: the `() => { … }` passed to `evaluate` runs **inside the page**; the rest runs in
the automation's sandbox.

## 3. Run it

1. Open a browser tab — double-click **`Tabs/Example.url`** (or any page).
2. Click back into `my-first.ts` so the editor is focused.
3. Press **`Cmd-Shift-R`**.

A green notification tells you how many paragraphs the page has. 🎉

### Experiment like a REPL

Change `"p"` to `"a"` (links) or `"img"` (images), then **select from the `import` line down
through the changed code** and press `Cmd-Shift-R` to run only that selection. Iterate until
it does what you want. (The selection is a complete little program, so it needs the `import`.)

## 4. Save it as a command

Turn your script into a permanent command you can run from anywhere:

1. With `my-first.ts` focused, open the command palette (**`Cmd-Shift-P`**).
2. Run **"Automations: Register Current File"**. A notification confirms
   **"Registered: Automations: My First"**.

The command is named **automatically from the file name** — `my-first.ts` becomes
*My First* (dashes become spaces, words get capitalized). So to give a command a clearer
name, just name the file for what it does: `count-paragraphs.ts` would register as
**Automations: Count Paragraphs**.

Now open the palette any time and run **"Automations: My First"** — it runs your script
against the active tab, with no need to open the file. It sticks around across restarts.

## Where to go next

- Edit any script in `Automations/browser/` and make it your own — start with
  `fetch-titles.ts` if you want the multi-page pattern.
- Need more than a page can give you? Declare extra permissions in a leading comment —
  `// @permissions net=api.github.com` — and Tranquil asks you to approve them on first run.
- Tranquil is growing a second kind of automation too — **workflows** that run on a schedule
  or webhook rather than by keystroke. Sample workflows are coming to `Automations/workflows/`;
  until then, read about them on the web. That's a bigger topic for another day.

📖 **Learn more:** [Your First Automation](https://tranquil.tools/docs/latest/getting-started/first-automation/)
on the web.

---

**That's the tour.** You've arranged the workspace, driven the browser, run automations, and
written your own. Reopen this guide any time from **File → New Default Window**. Happy
building. 🛠️

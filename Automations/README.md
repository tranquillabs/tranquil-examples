# Automations

- [`browser/`](./browser) — **client**: runnable browser-automation scripts. Open a web page in a
  browser tab, then focus a `.js` and press **`Cmd-Shift-R`** (the **Automations: Run in Webview**
  command, `tranquil-automations:run-in-webview`). Each script gets a `tranquil` API + `atom`/`require`.
- [`workflows/`](./workflows) — **server**: `@tranquil/sdk` workflows the execution engine runs
  (triggers → steps → connections). Example workflows _coming soon_.

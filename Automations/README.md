# Automations

- [`browser/`](./browser) — **client**: runnable browser-automation scripts. Automations are
  TypeScript (`.ts`) run in a sandboxed [Deno](https://deno.com) subprocess. Open a web page in
  a browser tab, then focus a `.ts` and press **`Cmd-Shift-R`** (the **Automations: Run
  Automation** command, `tranquil-automations:run-automation`). Scripts import their API:
  `import { tabs, ui, files } from "tranquil/automation"`.
- [`workflows/`](./workflows) — `@tranquil/sdk` workflows the engine runs on triggers
  (webhook / schedule / event / manual). Example workflows _coming soon_.

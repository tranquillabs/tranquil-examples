# browser/ — client automation scripts

Runnable in the Tranquil client. Open a web page in a browser tab, then focus one of these
`.ts` files and press **`Cmd-Shift-R`** (the **Automations: Run Automation** command,
`tranquil-automations:run-automation`).

Automations are plain Deno TypeScript, run in a **sandboxed subprocess** — no network, file,
or shell access beyond what a script declares. The API comes from one import:

```ts
import { tabs, ui, files, clipboard, config, workspace, context } from "tranquil/automation";
```

- `tabs` — browser tabs: `active()`, `find()`, `open(url, { background })`, and per-tab
  `evaluate()`, `goto()`, `waitFor()`, `title()`, `screenshot()`.
- `ui` — `notify(message, { level })` toasts and `open(path, { split })` in the editor.
- `files` — read/write files next to the script (`files.write` returns the absolute path).
- `context` — the run's `trigger`, `scriptDir`, and cancel `signal`.

Extra permissions are declared in a leading comment and approved once on first run:

```ts
// @permissions net=api.github.com run=git
// @timeout 15m
```

Output, state, and cancel live in the **Automation Runs** panel (bottom dock —
"Automations: Toggle Runs Panel" in the palette).

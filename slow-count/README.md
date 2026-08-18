# slow-count

Counts to 60, one second at a time, printing each step to the Automation Runs panel. It exists to
give you a run that stays in flight long enough to cancel.

Run it, open the Runs panel, and press **Cancel** partway through. The run stops within a second and
is recorded as cancelled, with the steps it got through still in the output.

The interesting part is `context.signal`, which the runner aborts as soon as you press Cancel:

```ts
await delay(EVERY_MS, { signal: context.signal });
```

Passing the signal to whatever you wait on — `delay`, `fetch`, your own `AbortController` — is what
makes Cancel immediate. Without it the loop would still stop, but only at the next step boundary,
and cancelling a script that sleeps for a minute would take a minute to take effect.

Catching the abort lets the script finish tidily rather than being killed mid-work, which is where
you would close tabs or flush a partial file. If a script ignores the signal, the runner escalates:
a CANCEL frame, then SIGTERM, then SIGKILL a second later.

Declares `// @permissions none` — it only counts, so it never prompts for approval.
See the [Writing Automations guide](https://www.tranquillabs.dev/docs/guides/writing-automations/).

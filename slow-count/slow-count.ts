// Counts slowly, so there is a run in flight long enough to cancel — and shows how to stop
// cleanly when you do. Each step waits on `context.signal`, which the runner aborts the moment
// you press Cancel, so the script stops between steps instead of being killed mid-work.
// @permissions none
import { delay } from "jsr:@std/async@1/delay";
import { context, ui } from "tranquil/automation";

const STEPS = 60;
const EVERY_MS = 1000;

await ui.notify(`Counting to ${STEPS}. Press Cancel in the Automation Runs panel to stop it.`);

let cancelled = false;
let reached = 0;

try {
  for (let step = 1; step <= STEPS; step++) {
    // Passing the signal is what makes Cancel immediate: the wait rejects as soon as it aborts,
    // rather than running out the full second first. Without it the loop would still stop, but
    // only at the next step boundary.
    await delay(EVERY_MS, { signal: context.signal });
    reached = step;
    console.log(`step ${step}/${STEPS}`);
  }
} catch (error) {
  // The signal aborts with its own reason, so anything else is a real failure worth surfacing.
  if (!context.signal.aborted) throw error;
  cancelled = true;
}

if (cancelled) {
  // Tidy-up you would otherwise skip — closing tabs, flushing a partial file — belongs here.
  console.log(`Cancelled after ${reached} step(s); stopped cleanly.`);
} else {
  await ui.notify(`Done — counted to ${STEPS}.`, { level: "success" });
}

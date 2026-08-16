// Toggle a small "enhanced by Tranquil" banner on the active page.
// @permissions browser
import { tabs } from "tranquil/automation";

const tab = await tabs.active();
await tab.evaluate(() => {
  const existing = document.getElementById("tranquil-banner");
  if (existing) {
    existing.remove();
    return;
  }
  const el = document.createElement("p");
  el.id = "tranquil-banner";
  el.textContent = "This page was enhanced by a Tranquil automation.";
  el.style.cssText =
    "margin:1rem 0;padding:0.75rem 1rem;background:#f0f4ff;border:1px solid #c7d8ff;" +
    "border-radius:6px;font:14px Inter,sans-serif;color:#333";
  (document.querySelector("main") || document.body).prepend(el);
});

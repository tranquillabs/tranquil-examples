// Tranquil automation. Rules for writing and changing it: ~/.tranquil/llm/writing-automations.md
// Rough "reader mode": hide common clutter and widen the main column.
// @permissions page-js
import { tabs } from "tranquil/automation";

const tab = await tabs.active();
await tab.evaluate((page) => {
  page.document
    .querySelectorAll('header, footer, aside, nav, [role="banner"]')
    .forEach((el) => {
      el.style.display = "none";
    });
  const main = page.document.querySelector("main, article") || page.document.body;
  main.style.maxWidth = "720px";
  main.style.margin = "0 auto";
  main.style.fontSize = "18px";
  main.style.lineHeight = "1.6";
});

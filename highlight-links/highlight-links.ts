// Tranquil automation. Rules for writing and changing it: ~/.tranquil/llm/writing-automations.md
// Outline every external link on the active page.
// @permissions page-js
import { tabs } from "tranquil/automation";

const tab = await tabs.active();
await tab.evaluate((page) => {
  page.document.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.style.outline = "2px solid orange";
  });
});

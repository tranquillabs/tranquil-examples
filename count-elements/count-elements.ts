// Tranquil automation. Rules for writing and changing it: ~/.tranquil/llm/writing-automations.md
// Notify how many of a tag are on the page (edit the selector as needed).
// @permissions page-js
import { tabs, ui } from "tranquil/automation";

const tab = await tabs.active();
const count = await tab.evaluate((page) => page.document.querySelectorAll("p").length);
await ui.notify(`This page has ${count} paragraph(s).`);

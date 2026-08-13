// Notify how many of a tag are on the page (edit the selector as needed).
import { tabs, ui } from "tranquil/automation";

const tab = await tabs.active();
const count = await tab.evaluate(() => document.querySelectorAll("img").length);
await ui.notify(`This page has ${count} image(s).`);

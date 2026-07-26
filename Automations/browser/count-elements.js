// Notify how many of a tag are on the page (edit the selector as needed).
const tab = await tranquil.getActiveTab();
const count = await tab.evaluate(() => document.querySelectorAll('img').length);
tranquil.notify(`This page has ${count} image(s).`, 'info');

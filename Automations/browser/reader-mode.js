// Rough "reader mode": hide common clutter and widen the main column.
const tab = await tranquil.getActiveTab();
await tab.evaluate(() => {
  document.querySelectorAll('header, footer, aside, nav, [role="banner"]').forEach((el) => {
    el.style.display = 'none';
  });
  const main = document.querySelector('main, article') || document.body;
  main.style.maxWidth = '720px';
  main.style.margin = '0 auto';
  main.style.fontSize = '18px';
  main.style.lineHeight = '1.6';
});

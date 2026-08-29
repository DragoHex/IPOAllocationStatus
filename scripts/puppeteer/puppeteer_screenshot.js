const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle2' });
  } catch(e) {
    console.log(e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
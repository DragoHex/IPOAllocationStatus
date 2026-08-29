const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle0', timeout: 30000 });
    const html = await page.content();
    fs.writeFileSync('bse_dom_stealth.html', html);
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
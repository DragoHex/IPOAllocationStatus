const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));
    const html = await page.content();
    fs.writeFileSync('bse_rendered.html', html);
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
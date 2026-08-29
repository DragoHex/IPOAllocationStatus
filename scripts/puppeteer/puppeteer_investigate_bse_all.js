const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('api.bseindia.com')) {
      console.log(`[REQ] ${url}`);
    }
    request.continue();
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.bseindia.com')) {
      try {
        const text = await response.text();
        console.log(`[RES] ${url}`);
        console.log(`[BODY] ${text.substring(0, 1000)}`);
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Page loaded.");
    await page.screenshot({ path: 'screenshot3.png' });
    
    // Evaluate to click Equity
    await page.evaluate(() => {
      const labels = document.querySelectorAll('label');
      for (const label of labels) {
        if (label.innerText.trim().toLowerCase() === 'equity') {
          label.click();
          return;
        }
      }
    });
    
    console.log("Clicked Equity. Waiting...");
    await new Promise(r => setTimeout(r, 5000));
    
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
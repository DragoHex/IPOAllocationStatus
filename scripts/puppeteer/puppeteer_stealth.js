const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('api.bseindia.com') || url.includes('/api/')) {
      console.log(`REQ: ${request.method()} ${url}`);
      if (request.postData()) {
        console.log(`BODY: ${request.postData()}`);
      }
    }
    request.continue();
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.bseindia.com') || url.includes('/api/')) {
      console.log(`RES: ${response.status()} ${url}`);
      try {
        const text = await response.text();
        console.log(`RESPONSE BODY (${url}): ${text.substring(0, 500)}`);
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Page loaded");
    
    // click Equity
    const labels = await page.$$('label');
    for (const label of labels) {
      const text = await page.evaluate(el => el.innerText, label);
      if (text.includes('Equity')) {
        console.log("Clicking Equity...");
        await label.click();
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 5000));
    
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
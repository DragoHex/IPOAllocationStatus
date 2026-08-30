const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('api.bseindia.com')) {
      console.log(`[REQ] ${request.method()} ${url}`);
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
    
    // Using evaluate to find the radio input and click its label or itself
    await page.evaluate(() => {
       const el = document.getElementById('eq'); // often eq for equity
       if (el) el.click();
       const labels = document.querySelectorAll('label');
       for (const l of labels) {
         if (l.innerText.includes('Equity')) l.click();
       }
    });

    console.log("Clicked. Waiting 3 seconds...");
    await new Promise(r => setTimeout(r, 3000));
    
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
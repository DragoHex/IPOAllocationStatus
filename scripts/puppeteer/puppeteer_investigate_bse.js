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
    if (url.includes('appli_check')) {
      console.log(`[REQ] ${url}`);
    }
    request.continue();
  });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Page loaded.");
    await page.screenshot({ path: 'screenshot1.png' });
    
    // click Equity using evaluate to force click on the input
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="radio"]');
      for (const input of inputs) {
        if (input.value === 'E' || input.id.includes('eq') || input.nextElementSibling?.innerText.includes('Equity')) {
          input.click();
          return;
        }
      }
      // If we couldn't find by value/id, try label texts
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
    await page.screenshot({ path: 'screenshot2.png' });
    
    const options = await page.evaluate(() => {
      const selects = document.querySelectorAll('select');
      if (selects.length > 0) {
          return Array.from(selects[0].options).map(o => ({ value: o.value, text: o.text }));
      }
      return "No select element found";
    });
    
    console.log("Dropdown Options:", JSON.stringify(options, null, 2));

  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
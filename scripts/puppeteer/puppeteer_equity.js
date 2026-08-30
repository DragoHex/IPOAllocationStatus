const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    const url = request.url();
    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      console.log(`REQ: ${request.method()} ${url}`);
      if (request.postData()) {
        console.log(`BODY: ${request.postData()}`);
      }
    }
    request.continue();
  });
  
  page.on('response', async response => {
    const url = response.url();
    const req = response.request();
    if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
      console.log(`RES: ${response.status()} ${url}`);
      try {
        const text = await response.text();
        console.log(`RESPONSE BODY (${url}): ${text.substring(0, 500)}`);
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle2' });
    console.log("Page loaded");
    
    // Select the "Equity" radio button
    // It's probably an input with value="E" or similar, or just click the label
    // Wait for the labels
    const labels = await page.$$('label');
    for (const label of labels) {
      const text = await page.evaluate(el => el.innerText, label);
      if (text.includes('Equity')) {
        console.log("Found Equity label, clicking...");
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
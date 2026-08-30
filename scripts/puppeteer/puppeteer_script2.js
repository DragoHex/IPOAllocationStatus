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
        console.log(`RESPONSE BODY (${url}): ${text.substring(0, 100)}`);
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle2' });
  } catch(e) {
    console.log(e.message);
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set up network interception
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    if (request.url().includes('api.bseindia.com') || request.url().includes('api')) {
      console.log(`REQ: ${request.method()} ${request.url()}`);
      if (request.postData()) {
        console.log(`BODY: ${request.postData()}`);
      }
    }
    request.continue();
  });
  
  page.on('response', async response => {
    if (response.url().includes('api.bseindia.com') || response.url().includes('api')) {
      console.log(`RES: ${response.status()} ${response.url()}`);
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

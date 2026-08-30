const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.bseindia.com/investors/appli_check.aspx', { waitUntil: 'networkidle2' });
    
    // click Equity
    const labels = await page.$$('label');
    for (const label of labels) {
      const text = await page.evaluate(el => el.innerText, label);
      if (text.includes('Equity')) {
        await label.click();
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
    // output issue names dropdown
    const options = await page.evaluate(() => {
      const select = document.querySelector('select'); // find the first select or select[name="ddlIssue"]
      if (!select) return "No select found";
      return Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
    });
    console.log(JSON.stringify(options, null, 2));
    
  } catch(e) {
    console.log(e.message);
  }
  
  await browser.close();
})();
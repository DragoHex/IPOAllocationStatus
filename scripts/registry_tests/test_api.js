async function testLI() {
    const liUrl = 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/GetDetails';
    const liResp = await fetch(liUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    const liData = await liResp.json();
    const xml = liData.d || '';
    
    const tableRegex = /<Table>([\s\S]*?)<\/Table>/g;
    let match;
    let count = 0;
    while ((match = tableRegex.exec(xml)) !== null) {
      const tableContent = match[1];
      const idMatch = tableContent.match(/<company_id>(.*?)<\/company_id>/);
      const nameMatch = tableContent.match(/<companyname>(.*?)<\/companyname>/);
      if (idMatch && nameMatch) {
         if (nameMatch[1].includes('Symbiotec') || nameMatch[1].includes('SYMBIOTIC')) {
             console.log("Found:", nameMatch[1], idMatch[1]);
         }
         count++;
      }
    }
    console.log("Total Link Intime IPOs:", count);
}

testLI();

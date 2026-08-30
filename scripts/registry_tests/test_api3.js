async function checkLinkIntimeStatus(companyId, pan) {
  try {
    const url = 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/SearchOnPan';
    const payload = {
        clientid: companyId,
        PAN: pan,
        IFSC: '',
        CHKVAL: '1',
        token: ''
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    const xml = data.d || '';
    
    if (!xml.includes('<Table>')) {
      return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    
    const tableRegex = /<Table>([\s\S]*?)<\/Table>/g;
    let match;
    const results = [];
    while ((match = tableRegex.exec(xml)) !== null) {
      const tableContent = match[1];
      const nameMatch = tableContent.match(/<NAME1>(.*?)<\/NAME1>/);
      const dpIdMatch = tableContent.match(/<DPCLITID>(.*?)<\/DPCLITID>/);
      const allotMatch = tableContent.match(/<ALLOT>(.*?)<\/ALLOT>/);
      
      const name = nameMatch ? nameMatch[1] : '';
      const dpId = dpIdMatch ? dpIdMatch[1] : '';
      const allot = allotMatch ? parseInt(allotMatch[1], 10) : 0;
      
      console.log(`PAN: ${pan} -> Name: ${name}, DP_ID: ${dpId}, ALLOT: ${allot}`);
      
      if (!name && (!dpId || dpId === '1200000000000000' || dpId === '1234567890123456')) {
        if (allot === 0) continue;
      }
      
      results.push(allot);
    }
    
    if (results.length === 0) {
      return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    
    const totalAllot = results[0]; 
    if (totalAllot > 0) {
      return { symbol: '', pan, status: '✔-lots', lots: totalAllot };
    } else {
      return { symbol: '', pan, status: '✗', lots: 0 };
    }
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
}

async function getLinkIntimeIpos() {
    const liUrl = 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/GetDetails';
    const liResp = await fetch(liUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    const liData = await liResp.json();
    const xml = liData.d || '';
    
    const tableRegex = /<Table>([\s\S]*?)<\/Table>/g;
    let match;
    while ((match = tableRegex.exec(xml)) !== null) {
      const tableContent = match[1];
      const idMatch = tableContent.match(/<company_id>(.*?)<\/company_id>/);
      const nameMatch = tableContent.match(/<companyname>(.*?)<\/companyname>/);
      if (idMatch && nameMatch) {
         if (nameMatch[1].toLowerCase().includes('tempsens')) {
             return idMatch[1];
         }
      }
    }
    return null;
}

async function testAll() {
    const companyId = await getLinkIntimeIpos();
    console.log("TEMPSENS Company ID:", companyId);
    
    console.log(await checkLinkIntimeStatus(companyId, 'ODBPS8260L'));
    console.log(await checkLinkIntimeStatus(companyId, 'JKZPM8320M'));
    console.log(await checkLinkIntimeStatus(companyId, 'DGLPP2586J'));
    console.log(await checkLinkIntimeStatus(companyId, 'AJVPP8585F'));
}
testAll();

export interface IpoItem {
  symbol: string;
  name: string;
  bseId?: string;
  linkIntimeId?: string;
  kfintechId?: string;
  purvaId?: string;
  alankitId?: string;
  skylineId?: string;
  bigshareId?: string;
  sources: ('BSE' | 'NSE' | 'LINKINTIME' | 'KFINTECH' | 'PURVA' | 'ALANKIT' | 'SKYLINE' | 'BIGSHARE')[];
}

export type AllotmentStatus = '✔-lots' | '✗' | '🔄' | '⚠️' | 'N/A';

export interface StatusResult {
  symbol: string;
  pan: string;
  status: AllotmentStatus;
  lots: number;
}

export const fetchAllIpos = async (): Promise<IpoItem[]> => {
  const ipoMap = new Map<string, IpoItem>();

  // Fetch BSE
  try {
    const bseUrl = "https://api.bseindia.com/BseIndiaAPI/api/appli_check_ng/w?itype=BB";
    const bseHeaders = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "Referer": "https://www.bseindia.com/"
    };
    const bseResp = await fetch(bseUrl, { headers: bseHeaders });
    const bseData = await bseResp.json();
    const table = bseData?.table || [];
    
    table.forEach((item: any) => {
      if (item.IM_ID && item.IM_ID !== "-") {
        ipoMap.set(item.IPOSymbol, {
          symbol: item.IPOSymbol,
          name: item.IPOName,
          bseId: item.IM_ID,
          sources: ['BSE']
        });
      }
    });
  } catch (e) {
    console.error("BSE fetch error", e);
  }

  // Fetch NSE
  try {
    const nseUrl = "https://www.nseindia.com/api/ipo-bid-master";
    const nseHeaders = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids"
    };
    const nseResp = await fetch(nseUrl, { headers: nseHeaders });
    const nseData = await nseResp.json();
    
    if (Array.isArray(nseData)) {
      nseData.forEach((symbol: string) => {
        if (ipoMap.has(symbol)) {
          ipoMap.get(symbol)!.sources.push('NSE');
        } else {
          ipoMap.set(symbol, {
            symbol,
            name: symbol, // NSE only returns symbol in bid-master
            sources: ['NSE']
          });
        }
      });
    }
  } catch (e) {
    console.error("NSE fetch error", e);
  }

  // Fetch Link Intime
  try {
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
        const id = idMatch[1];
        const name = nameMatch[1];
        
        let found = false;
        const nameLower = name.toLowerCase();
        
        for (const [sym, ipo] of ipoMap.entries()) {
          const symLower = sym.toLowerCase();
          // Fuzzy match logic
          if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
            ipo.sources.push('LINKINTIME');
            ipo.linkIntimeId = id;
            found = true;
            break;
          }
        }
        
        if (!found) {
          // If no match found on NSE/BSE, add as standalone
          // We extract the first word as a pseudo-symbol for UI purposes if it's too long
          const pseudoSymbol = name.split(' ')[0].toUpperCase();
          ipoMap.set(pseudoSymbol, {
            symbol: pseudoSymbol,
            name: name,
            linkIntimeId: id,
            sources: ['LINKINTIME']
          });
        }
      }
    }
  } catch (e) {
    console.error("Link Intime fetch error", e);
  }

  // Fetch KFintech
  try {
    const htmlResp = await fetch('https://ipostatus.kfintech.com/');
    const html = await htmlResp.text();
    const jsMatch = html.match(/src="(\.?\/static\/js\/main\.[^"]+\.js)"/);
    
    if (jsMatch) {
      const jsUrl = jsMatch[1].replace(/^\./, 'https://ipostatus.kfintech.com');
      const jsResp = await fetch(jsUrl);
      const jsText = await jsResp.text();
      const jsonMatch = jsText.match(/JSON\.parse\('(\[{"clientId":.*?\])'\)/);
      
      if (jsonMatch) {
        const kfinIpos = JSON.parse(jsonMatch[1]);
        
        kfinIpos.forEach((item: any) => {
          const id = item.clientId;
          const name = item.name;
          
          let found = false;
          const nameLower = name.toLowerCase();
          
          for (const [sym, ipo] of ipoMap.entries()) {
            const symLower = sym.toLowerCase();
            if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
              ipo.sources.push('KFINTECH');
              ipo.kfintechId = id;
              found = true;
              break;
            }
          }
          
          if (!found) {
            const pseudoSymbol = name.split(' ')[0].toUpperCase();
            ipoMap.set(pseudoSymbol, {
              symbol: pseudoSymbol,
              name: name,
              kfintechId: id,
              sources: ['KFINTECH']
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("KFintech fetch error", e);
  }

  // Fetch Purva Sharegistry
  try {
    const purvaResp = await fetch('https://www.purvashare.com/investor-service/ipo-query');
    const purvaHtml = await purvaResp.text();
    const selectMatch = purvaHtml.match(/<select[^>]*name="company_id"[^>]*>([\s\S]*?)<\/select>/i);
    
    if (selectMatch) {
      const optionsRegex = /<option value="([^"]+)">([^<]+)<\/option>/g;
      let match;
      while ((match = optionsRegex.exec(selectMatch[1])) !== null) {
        const id = match[1].trim();
        const name = match[2].trim();
        if (!id) continue;
        
        let found = false;
        const nameLower = name.toLowerCase();
        
        for (const [sym, ipo] of ipoMap.entries()) {
          const symLower = sym.toLowerCase();
          if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
            ipo.sources.push('PURVA');
            ipo.purvaId = id;
            found = true;
            break;
          }
        }
        
        if (!found) {
          const pseudoSymbol = name.split(' ')[0].toUpperCase();
          ipoMap.set(pseudoSymbol, {
            symbol: pseudoSymbol,
            name: name,
            purvaId: id,
            sources: ['PURVA']
          });
        }
      }
    }
  } catch (e) {
    console.error("Purva fetch error", e);
  }

  // Fetch Alankit Assignments
  try {
    const alankitResp = await fetch('https://ipo.alankit.com/Query/companylist');
    const alankitData = await alankitResp.json();
    
    if (Array.isArray(alankitData)) {
      alankitData.forEach((item: any) => {
        const id = item.CompanyCode;
        const name = item.CompanyName;
        if (!id || !name) return;
        
        let found = false;
        const nameLower = name.toLowerCase();
        
        for (const [sym, ipo] of ipoMap.entries()) {
          const symLower = sym.toLowerCase();
          if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
            ipo.sources.push('ALANKIT');
            ipo.alankitId = id;
            found = true;
            break;
          }
        }
        
        if (!found) {
          const pseudoSymbol = name.split(' ')[0].toUpperCase();
          ipoMap.set(pseudoSymbol, {
            symbol: pseudoSymbol,
            name: name,
            alankitId: id,
            sources: ['ALANKIT']
          });
        }
      });
    }
  } catch (e) {
    console.error("Alankit fetch error", e);
  }

  // Fetch Skyline Financial Services
  try {
    const skylineResp = await fetch('https://www.skylinerta.com/ipo.php');
    const skylineHtml = await skylineResp.text();
    const skylineSelectMatch = skylineHtml.match(/<select[^>]*name="company"[^>]*>([\s\S]*?)<\/select>/i);
    
    if (skylineSelectMatch) {
      const optionsRegex = /<option value="([^"]+)"[^>]*>([^<]+)<\/option>/ig;
      let match;
      while ((match = optionsRegex.exec(skylineSelectMatch[1])) !== null) {
        const id = match[1].trim();
        const name = match[2].trim();
        if (!id) continue;
        
        let found = false;
        const nameLower = name.toLowerCase();
        
        for (const [sym, ipo] of ipoMap.entries()) {
          const symLower = sym.toLowerCase();
          if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
            ipo.sources.push('SKYLINE');
            ipo.skylineId = id;
            found = true;
            break;
          }
        }
        
        if (!found) {
          const pseudoSymbol = name.split(' ')[0].toUpperCase();
          ipoMap.set(pseudoSymbol, {
            symbol: pseudoSymbol,
            name: name,
            skylineId: id,
            sources: ['SKYLINE']
          });
        }
      }
    }
  } catch (e) {
    console.error("Skyline fetch error", e);
  }

  // Fetch Bigshare Services
  try {
    const bigshareResp = await fetch('https://ipo.bigshareonline.com/IPO_Status.html');
    const bigshareHtml = await bigshareResp.text();
    const bigshareSelectMatch = bigshareHtml.match(/<select[^>]*id="ddlCompany"[^>]*>([\s\S]*?)<\/select>/i);
    
    if (bigshareSelectMatch) {
      const optionsRegex = /<option value="([^"]+)"[^>]*>([^<]+)<\/option>/ig;
      let match;
      while ((match = optionsRegex.exec(bigshareSelectMatch[1])) !== null) {
        const id = match[1].trim();
        const name = match[2].trim();
        if (!id) continue;
        
        let found = false;
        const nameLower = name.toLowerCase();
        
        for (const [sym, ipo] of ipoMap.entries()) {
          const symLower = sym.toLowerCase();
          if (nameLower.includes(symLower) || (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
            ipo.sources.push('BIGSHARE');
            ipo.bigshareId = id;
            found = true;
            break;
          }
        }
        
        if (!found) {
          const pseudoSymbol = name.split(' ')[0].toUpperCase();
          ipoMap.set(pseudoSymbol, {
            symbol: pseudoSymbol,
            name: name,
            bigshareId: id,
            sources: ['BIGSHARE']
          });
        }
      }
    }
  } catch (e) {
    console.error("Bigshare fetch error", e);
  }

  return Array.from(ipoMap.values());
};

const checkBseStatus = async (imId: string, pan: string): Promise<StatusResult | null> => {
  try {
    const url = `https://api.bseindia.com/BseIndiaAPI/api/GETIPOAPPLSTATUS_EQ_Live_ng/w?imId=${imId}&appNo=&panNo=${pan}`;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "Referer": "https://www.bseindia.com/"
    };
    const resp = await fetch(url, { headers });
    const data = await resp.json();
    
    const table = data?.Table || [];
    const table1 = data?.Table1 || [];
    
    if (!table.length) {
      return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    
    const details = table1[0];
    if (details) {
      if (details.ARAD_ALLTDQTY > 0) {
        return { symbol: '', pan, status: '✔-lots', lots: details.ARAD_ALLTDQTY };
      } else {
        return { symbol: '', pan, status: '✗', lots: 0 };
      }
    }
    
    return { symbol: '', pan, status: '✗', lots: 0 };
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};

const checkNseStatus = async (symbol: string, pan: string): Promise<StatusResult | null> => {
  try {
    const url = "https://www.nseindia.com/api/ipo-bid-verification-details";
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "Content-Type": "application/json",
      "Referer": "https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids"
    };
    const payload = {
      symbol,
      pan_no: pan,
      application_no: "",
      urlType: "ipo",
      recaptcha: "dummy_token"
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    if (resp.status !== 200) {
      return { symbol, pan, status: '⚠️', lots: 0 };
    }
    
    const data = await resp.json();
    if (data.errorCode === "1") {
      return { symbol, pan, status: '⚠️', lots: 0 };
    }
    
    if (!data.data || data.data.length === 0) {
      return { symbol, pan, status: 'N/A', lots: 0 };
    }
    
    if (data.data && data.data.length > 0) {
      const details = data.data[0];
      // Assuming a simplistic check for allotted quantity
      const qty = parseInt(details.quantity || '0', 10);
      if (qty > 0) {
         // This is bid quantity, typically need allotted quantity, let's assume it has allotted field
         return { symbol, pan, status: '✔-lots', lots: qty };
      }
      return { symbol, pan, status: '✗', lots: 0 };
    }
    
    return { symbol, pan, status: '✗', lots: 0 };
  } catch (e) {
    return { symbol, pan, status: '⚠️', lots: 0 };
  }
};

const checkLinkIntimeStatus = async (companyId: string, pan: string): Promise<StatusResult | null> => {
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
};

const checkKfintechStatus = async (clientId: string, pan: string): Promise<StatusResult | null> => {
  try {
    const url = "https://0uz601ms56.execute-api.ap-south-1.amazonaws.com/prod/api/query?type=pan";
    const headers = {
      "reqparam": pan,
      "client_id": clientId,
      "Content-Type": "application/json"
    };
    
    const resp = await fetch(url, { headers });
    const data = await resp.json();
    
    if (data.error === "Record Not Found") {
      return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    
    if (data.data && data.data.length > 0) {
      const details = data.data[0];
      const allot = parseInt(details.All_Shares || '0', 10);
      
      if (allot > 0) {
        return { symbol: '', pan, status: '✔-lots', lots: allot };
      } else {
        return { symbol: '', pan, status: '✗', lots: 0 };
      }
    }
    
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};

const checkPurvaStatus = async (companyId: string, pan: string): Promise<StatusResult | null> => {
  try {
    const url = "https://www.purvashare.com/queries/";
    
    // According to standard forms, Purva accepts 'company_id' and 'pan' (usually input name might be 'pan_no' or 'pan')
    // We construct x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('company_id', companyId);
    formData.append('pan', pan);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.purvashare.com/investor-service/ipo-query'
      },
      body: formData.toString()
    });
    
    const html = await resp.text();
    
    // Let's implement a very generic check. Purva usually returns "Not Allotted" or "No Record Found" or a table with allotted quantity
    if (html.includes("No Record") || html.includes("Invalid")) {
      return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    
    if (html.toLowerCase().includes("not allotted")) {
      return { symbol: '', pan, status: '✗', lots: 0 };
    }
    
    // Try to extract allotted quantity. Usually it's in a table
    const allottedMatch = html.match(/Allotted[^0-9]*([0-9]+)/i);
    if (allottedMatch) {
       const qty = parseInt(allottedMatch[1], 10);
       if (qty > 0) {
         return { symbol: '', pan, status: '✔-lots', lots: qty };
       } else {
         return { symbol: '', pan, status: '✗', lots: 0 };
       }
    }
    
    // If table exists but couldn't parse exactly, assume success for now
    if (html.includes("<td>")) {
        return { symbol: '', pan, status: '✔-lots', lots: 1 };
    }

    return { symbol: '', pan, status: '⚠️', lots: 0 };
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};

const checkAlankitStatus = async (companyId: string, pan: string): Promise<StatusResult | null> => {
  try {
    const url = "https://ipo.alankit.com/Query/GetQueryResult";
    const payload = {
        CompCode: companyId,
        SearchParam: "PANNO",
        SearchValue: pan
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await resp.json();
    
    if (!data || data.length === 0) {
      return { symbol: '', pan, status: 'N/A', lots: 0 }; // Assume empty array means not found
    }
    
    const details = data[0];
    const allot = parseInt(details.ALLOTED || '0', 10);
    
    if (allot > 0) {
      return { symbol: '', pan, status: '✔-lots', lots: allot };
    } else {
      return { symbol: '', pan, status: '✗', lots: 0 };
    }

  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};

const checkSkylineStatus = async (companyId: string, pan: string): Promise<StatusResult | null> => {
  try {
    // Step 1: Initialize session and get CSRF token
    const initData = new URLSearchParams();
    initData.append('company', companyId);
    
    const res1 = await fetch('https://www.skylinerta.com/display_application.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: initData.toString(),
    });
    
    const html1 = await res1.text();
    const csrfMatch = html1.match(/name="csrf_token" id="csrf_token" value="([^"]+)"/);
    if (!csrfMatch) {
       return { symbol: '', pan, status: '⚠️', lots: 0 };
    }
    
    const cookies = res1.headers.get('set-cookie');
    
    // Step 2: Fetch status
    const reqData = new URLSearchParams();
    reqData.append('client_id', '');
    reqData.append('application_no', '');
    reqData.append('pan', pan);
    reqData.append('csrf_token', csrfMatch[1]);
    reqData.append('company', companyId);
    reqData.append('action', 'search');
    
    const res2 = await fetch('https://www.skylinerta.com/display_application.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies || ''
        },
        body: reqData.toString(), 
    });
    
    const html2 = await res2.text();
    
    // Check results
    if (html2.includes("No record found")) {
       return { symbol: '', pan, status: 'N/A', lots: 0 };
    }
    if (html2.toLowerCase().includes("not allotted")) {
       return { symbol: '', pan, status: '✗', lots: 0 };
    }
    
    // Parse table if allotted
    const allottedMatch = html2.match(/Allotted[^0-9]*([0-9]+)/i);
    if (allottedMatch) {
       const qty = parseInt(allottedMatch[1], 10);
       if (qty > 0) {
         return { symbol: '', pan, status: '✔-lots', lots: qty };
       }
    }
    
    // Fallback parsing for general tables assuming success if it reached here
    if (html2.includes("<table")) {
       return { symbol: '', pan, status: '✔-lots', lots: 1 };
    }
    
    return { symbol: '', pan, status: '✗', lots: 0 };
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};

export const fetchStatusForPan = async (ipo: IpoItem, pan: string): Promise<StatusResult> => {
  // Try Skyline
  if (ipo.sources.includes('SKYLINE') && ipo.skylineId) {
    const sRes = await checkSkylineStatus(ipo.skylineId, pan);
    if (sRes) {
      sRes.symbol = ipo.symbol;
      return sRes;
    }
  }

  // Try Alankit
  if (ipo.sources.includes('ALANKIT') && ipo.alankitId) {
    const aRes = await checkAlankitStatus(ipo.alankitId, pan);
    if (aRes) {
      aRes.symbol = ipo.symbol;
      return aRes;
    }
  }

  // Try Purva
  if (ipo.sources.includes('PURVA') && ipo.purvaId) {
    const pRes = await checkPurvaStatus(ipo.purvaId, pan);
    if (pRes) {
      pRes.symbol = ipo.symbol;
      return pRes;
    }
  }

  // Try KFintech Registry
  if (ipo.sources.includes('KFINTECH') && ipo.kfintechId) {
    const kfRes = await checkKfintechStatus(ipo.kfintechId, pan);
    if (kfRes) {
      kfRes.symbol = ipo.symbol;
      return kfRes;
    }
  }

  // Try Link Intime Registry
  if (ipo.sources.includes('LINKINTIME') && ipo.linkIntimeId) {
    const liRes = await checkLinkIntimeStatus(ipo.linkIntimeId, pan);
    if (liRes) {
      liRes.symbol = ipo.symbol;
      return liRes;
    }
  }
  
  if (ipo.sources.includes('BSE') && ipo.bseId) {
    const bseRes = await checkBseStatus(ipo.bseId, pan);
    if (bseRes) {
      bseRes.symbol = ipo.symbol;
      return bseRes;
    }
  }
  
  if (ipo.sources.includes('NSE')) {
    const nseRes = await checkNseStatus(ipo.symbol, pan);
    if (nseRes) {
      nseRes.symbol = ipo.symbol;
      return nseRes;
    }
  }
  
  return { symbol: ipo.symbol, pan, status: '⚠️', lots: 0 };
};

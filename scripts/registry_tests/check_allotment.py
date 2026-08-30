import requests
import json
import argparse
import re
import xml.etree.ElementTree as ET
from difflib import SequenceMatcher

def get_bse_ipos():
    url = "https://api.bseindia.com/BseIndiaAPI/api/appli_check_ng/w?itype=BB"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Referer": "https://www.bseindia.com/"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        data = resp.json()
        return data.get("table", [])
    except Exception as e:
        print(f"BSE Error: {e}")
        return []

def get_nse_ipos():
    url = "https://www.nseindia.com/api/ipo-bid-master"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        return resp.json()
    except Exception as e:
        print(f"NSE Error: {e}")
        return []

def get_linkintime_ipos():
    url = 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/GetDetails'
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    try:
        resp = requests.post(url, headers=headers, timeout=10)
        data = resp.json()
        xml_data = data.get('d', '')
        root = ET.fromstring(xml_data)
        ipos = []
        for table in root.findall('.//Table'):
            company_id = table.findtext('company_id')
            companyname = table.findtext('companyname')
            if company_id and companyname:
                ipos.append({'company_id': company_id, 'companyname': companyname})
        return ipos
    except Exception as e:
        print(f'Link Intime Error: {e}')
        return []

def match_company(symbol, nse_bse_name, registry_names):
    best_match = None
    best_score = 0
    
    symbol_clean = symbol.lower().replace(' ', '')
    
    for r_item in registry_names:
        r_name_clean = r_item['companyname'].lower()
        
        score = 0
        if nse_bse_name:
            n_clean = nse_bse_name.lower()
            score = max(score, SequenceMatcher(None, n_clean, r_name_clean).ratio())
            if n_clean in r_name_clean or r_name_clean in n_clean:
                score = max(score, 0.9)
                
        first_word = re.split(r'\W+', r_name_clean)[0]
        score = max(score, SequenceMatcher(None, symbol_clean, first_word).ratio())
        
        if symbol_clean in r_name_clean:
            score = max(score, 0.85)
            
        if score > best_score:
            best_score = score
            best_match = r_item
            
    if best_score > 0.6:  # Threshold for a good match
        return best_match
    return None

def check_linkintime_status(company_id, pan):
    url = 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/SearchOnPan'
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    payload = {
        'clientid': company_id,
        'PAN': pan,
        'IFSC': '',
        'CHKVAL': '1',
        'token': ''
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        data = resp.json()
        xml_data = data.get('d', '')
        root = ET.fromstring(xml_data)
        
        tables = root.findall('.//Table')
        if not tables:
            return {'status': 'Not Applied', 'details': None}
            
        results = []
        for table in tables:
            name = table.findtext('NAME1')
            dp_id = table.findtext('DPCLITID')
            allot = int(table.findtext('ALLOT') or 0)
            shares = int(table.findtext('SHARES') or 0)
            
            # Check for dummy DP ID and missing name -> Not Applied
            if not name and (not dp_id or dp_id == '1200000000000000' or dp_id == '1234567890123456'):
                if allot == 0:
                    continue 
                
            status_text = 'Allocated' if allot > 0 else 'Not Allocated'
            results.append({
                'name': name,
                'dp_id': dp_id,
                'applied_shares': shares,
                'allotted_shares': allot,
                'status': status_text,
                'raw': {child.tag: child.text for child in table}
            })
            
        if not results:
            return {'status': 'Not Applied', 'details': None}
            
        return {'status': results[0]['status'], 'details': results}
        
    except Exception as e:
        return {'status': f'Error: {e}', 'details': None}

def check_bse_status(im_id, pan):
    url = f"https://api.bseindia.com/BseIndiaAPI/api/GETIPOAPPLSTATUS_EQ_Live_ng/w?imId={im_id}&appNo=&panNo={pan}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Referer": "https://www.bseindia.com/"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        data = resp.json()
        
        # Check if table has data
        table = data.get("Table", [])
        table1 = data.get("Table1", [])
        
        if not table:
            return {"status": "Not Found / Invalid", "details": None}
            
        return {
            "status": "Found",
            "applicant_details": table[0] if table else None,
            "allotment_details": table1[0] if table1 else None
        }
    except Exception as e:
        return {"status": f"Error: {str(e)}", "details": None}

def check_nse_status(symbol, pan):
    url = "https://www.nseindia.com/api/ipo-bid-verification-details"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Content-Type": "application/json",
        "Referer": "https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids"
    }
    payload = {
        "symbol": symbol,
        "pan_no": pan,
        "application_no": "",
        "urlType": "ipo",
        "recaptcha": "dummy_token"
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        
        # NSE typically blocks without valid recaptcha/cookies
        if resp.status_code != 200:
            return {"status": f"Blocked by NSE (HTTP {resp.status_code})", "details": None}
            
        data = resp.json()
        if data.get("errorCode") == "1":
            return {"status": f"Error: {data.get('errorMessage')}", "details": None}
            
        return {
            "status": "Found" if data.get("data") else "Not Found",
            "details": data.get("data", [])
        }
    except Exception as e:
        return {"status": f"Error: {str(e)}", "details": None}

def check_allotment(pans, symbol):
    results = {}
    
    bse_ipos = get_bse_ipos()
    nse_ipos = get_nse_ipos()
    
    bse_match = next((item for item in bse_ipos if item.get("IPOSymbol") == symbol), None)
    nse_match = symbol in nse_ipos
    
    if not bse_match and not nse_match:
        # Check if the symbol is in Link Intime anyway, even if not in NSE/BSE active lists
        pass
        
    bse_name = bse_match["IPOName"] if bse_match else None
    
    linkintime_ipos = get_linkintime_ipos()
    matched_linkintime = match_company(symbol, bse_name, linkintime_ipos)
    
    for pan in pans:
        pan_result = {}
        
        # 1. Try Registry First (Link Intime)
        if matched_linkintime:
            pan_result["Registry (Link Intime)"] = check_linkintime_status(matched_linkintime['company_id'], pan)
        
        # 2. Fallback to BSE/NSE if registry not found or as additional info
        if bse_match:
            pan_result["BSE"] = check_bse_status(bse_match["IM_ID"], pan)
        if nse_match:
            pan_result["NSE"] = check_nse_status(symbol, pan)
            
        results[pan] = pan_result
        
    return results

if __name__ == "__main__":
    test_pans = ["ODBPS8260L", "JKZPM8320M", "DGLPP2586J", "AAAAA0000A"]
    sym = "SYMBIOTIC"
    print(f"Testing PANs {test_pans} against symbol: {sym}\n")
    res = check_allotment(test_pans, sym)
    print(json.dumps(res, indent=2))
    print("-" * 40)
    
    test_pan = "DGLPP2586J"
    bse_list = get_bse_ipos()
    if not bse_list or bse_list[0].get("IM_ID") == "-":
        print("No active IPOs on BSE right now or API blocked.")
    else:
        test_symbols = [item["IPOSymbol"] for item in bse_list[:2]]
        print(f"Testing PAN {test_pan} against symbols: {test_symbols}\n")
        for sym in test_symbols:
            print(f"Checking {sym}...")
            res = check_allotment([test_pan], sym)
            print(json.dumps(res, indent=2))
            print("-" * 40)

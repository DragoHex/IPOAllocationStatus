import requests
from bs4 import BeautifulSoup

def check_linkintime():
    url = "https://in.mpms.mufg.com/Initial_Offer/public-issues.html"
    try:
        resp = requests.get(url, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        select = soup.find('select', id='company_id')
        print("Select element:", select is not None)
        if select:
            options = select.find_all('option')
            print("Link Intime Companies count:", len(options))
            for opt in options[:10]:
                print(opt.get('value'), opt.text)
            
            # Check for symbiotic
            for opt in options:
                if 'symbiotic' in opt.text.lower():
                    print("FOUND SYMBIOTIC IN LINK INTIME:", opt.get('value'), opt.text)
    except Exception as e:
        print("Error Link Intime:", e)

check_linkintime()

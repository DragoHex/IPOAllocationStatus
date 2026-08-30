import re
from difflib import SequenceMatcher

def match_company(symbol, nse_bse_name, registry_names):
    best_match = None
    best_score = 0
    
    # Clean up symbol
    symbol = symbol.lower().replace(' ', '')
    
    for r_name in registry_names:
        r_name_clean = r_name.lower()
        
        score = 0
        # 1. Match full name from NSE/BSE
        if nse_bse_name:
            n_clean = nse_bse_name.lower()
            score = max(score, SequenceMatcher(None, n_clean, r_name_clean).ratio())
            # Substring match
            if n_clean in r_name_clean or r_name_clean in n_clean:
                score = max(score, 0.9)
                
        # 2. Match symbol with first word of registry name
        first_word = re.split(r'\W+', r_name_clean)[0]
        score = max(score, SequenceMatcher(None, symbol, first_word).ratio())
        
        if symbol in r_name_clean:
            score = max(score, 0.85)
            
        if score > best_score:
            best_score = score
            best_match = r_name
            
    return best_match, best_score

print(match_company("SYMBIOTIC", None, ["Symbiotec Pharmalab Limited - IPO", "Augmont Enterprises Limited - IPO"]))
print(match_company("ESDS", "ESDS Software Solution Limited", ["ESDS Software Solution Limited - IPO", "Augmont Enterprises Limited - IPO"]))

---
name: ipo-integration
description: Integrate new IPO registrars into the allocation tracker fetch flow. Use when adding a new registrar API, parsing registrar HTML/JSON, or updating the fetchStatusForPan routing logic.
---

# IPO Registrar Integration

## Quick Start

1. Find API endpoint (Network tab) or web form structure for registrar.
2. Determine payload (PAN, App No, Client ID). Check for auth/CSRF.
3. Test with `fetch` in temporary script. 
4. Update `IpoItem` interface with new registrar ID field and source enum.
5. Add logic to `fetchAllIpos()` to pull IPO list and fuzzy match symbols.
6. Create `check[Registrar]Status()` function.
7. Route new registrar in `fetchStatusForPan()`.

## 1. Registry API Discovery

Extract endpoints:
- JSON APIs: Ideal. Find GET/POST endpoints.
- Web forms: Check `action`, `method`. Extract `<select>` for IPO list.
- Security: Check for `x-api-key`, `Authorization`, `Cookie`, or hidden inputs like `csrf_token`.
- Hard blockers: Captchas (image/reCAPTCHA). If server validated, UI flow must change. If client validated, bypass.

Test script template (`test_registry.js`):
```javascript
const formData = new URLSearchParams();
formData.append('pan', 'PAN123456A');
formData.append('company_id', '123');

const res = await fetch('https://registrar.com/api', {
    method: 'POST',
    body: formData
});
console.log(await res.text());
```

## 2. Interface Update

File: `src/api/index.ts`

Update `IpoItem` with new source:
```typescript
export interface IpoItem {
  symbol: string;
  name: string;
  bseId?: string;
  newRegistrarId?: string; // Add ID
  sources: ('BSE' | 'NSE' | 'NEW_REG')[]; // Add Enum
}
```

## 3. List Fetching & Merging

File: `src/api/index.ts` -> `fetchAllIpos()`

Fetch raw list from registrar. Map to existing IPOs using fuzzy match on `name`.
```typescript
try {
  const resp = await fetch('https://registrar.com/ipo-list');
  const data = await resp.json(); // or parse HTML <select>
  
  data.forEach((item: any) => {
    let found = false;
    const nameLower = item.name.toLowerCase();
    
    // Fuzzy match against existing NSE/BSE items
    for (const [sym, ipo] of ipoMap.entries()) {
      if (nameLower.includes(sym.toLowerCase()) || 
         (ipo.name && nameLower.includes(ipo.name.toLowerCase()))) {
        ipo.sources.push('NEW_REG');
        ipo.newRegistrarId = item.id;
        found = true;
        break;
      }
    }
    
    // Fallback: standalone item if not in NSE/BSE
    if (!found) {
      const pseudoSymbol = item.name.split(' ')[0].toUpperCase();
      ipoMap.set(pseudoSymbol, {
        symbol: pseudoSymbol,
        name: item.name,
        newRegistrarId: item.id,
        sources: ['NEW_REG']
      });
    }
  });
} catch (e) {
  console.error("Registrar fetch error", e);
}
```

## 4. Status Checker Function

File: `src/api/index.ts`

Map response to `StatusResult`. Handle `N/A` (not applied) vs `✗` (applied, 0 lots).
```typescript
const checkNewRegistrarStatus = async (id: string, pan: string): Promise<StatusResult | null> => {
  try {
    const res = await fetch('...');
    const data = await res.json();
    
    if (data.error === "Not Found") return { symbol: '', pan, status: 'N/A', lots: 0 };
    
    const allot = parseInt(data.allotmentQty || '0', 10);
    if (allot > 0) return { symbol: '', pan, status: '✔-lots', lots: allot };
    return { symbol: '', pan, status: '✗', lots: 0 };
  } catch (e) {
    return { symbol: '', pan, status: '⚠️', lots: 0 };
  }
};
```

## 5. Route Update

File: `src/api/index.ts` -> `fetchStatusForPan()`

Prioritize registrar checks over NSE/BSE fallback.
```typescript
export const fetchStatusForPan = async (ipo: IpoItem, pan: string): Promise<StatusResult> => {
  // Check new registrar first
  if (ipo.sources.includes('NEW_REG') && ipo.newRegistrarId) {
    const res = await checkNewRegistrarStatus(ipo.newRegistrarId, pan);
    if (res) {
      res.symbol = ipo.symbol;
      return res;
    }
  }
  // ... fallbacks
}
```
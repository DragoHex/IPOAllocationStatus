# BSE India IPO Allotment Status API

## 1. Fetch Issue Name API

This API fetches the list of active IPOs (Issue Names) available for allotment status check on BSE.

**Endpoint:** 
`GET https://api.bseindia.com/BseIndiaAPI/api/appli_check_ng/w`

**Query Parameters:**
- `itype`: Issue type. Use `BB` for Equity (Book Building) and `DBT` for Debt. (e.g., `?itype=BB`)

**Headers:**
- `Referer`: `https://www.bseindia.com/` (Required. Without this, you may get a block page)
- `User-Agent`: (Standard browser User-Agent string)

**Response Structure:**
The response is a JSON object with a `table` array containing the list of IPOs.
```json
{
  "table": [
    {
      "IM_ID": "4770",
      "IPOName": "ESDS Software Solution Limited",
      "IPOSymbol": "ESDS"
    }
  ]
}
```
*(If no issues are available, it may return dummy values like `"-"` or an empty array `[]`)*.

---

## 2. Fetch Allotment Status API (Equity)

This API fetches the allotment details for a given IPO `IM_ID` and either PAN Number or Application Number.

**Endpoint:**
`GET https://api.bseindia.com/BseIndiaAPI/api/GETIPOAPPLSTATUS_EQ_Live_ng/w`

**Query Parameters:**
- `imId`: The `IM_ID` obtained from the Issue Name API.
- `appNo`: Application Number (leave empty if using PAN).
- `panNo`: PAN Number (leave empty if using Application Number).

Example: `?imId=4770&appNo=&panNo=ABCDE1234F`

**Headers:**
- `Referer`: `https://www.bseindia.com/` (Required)
- `User-Agent`: (Standard browser User-Agent string)

**Response Structure:**
The response contains arrays of data. If the application is not found or is invalid, the tables are returned empty.
```json
{
  "Table": [],
  "Table1": [],
  "Table2": []
}
```
If a valid record is found, `Table` usually contains application details (such as Name, Application No, Category, DP ID/Client ID), and `Table1` or `Table2` contain the bid details (Quantity, Allotted Quantity, Cut-off Price, etc.).

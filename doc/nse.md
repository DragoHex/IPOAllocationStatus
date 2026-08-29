# NSE India IPO Allotment Status API

## 1. Fetch Issue Name API

This API fetches the list of active IPO symbols available for allotment status check.

**Endpoint:** 
`GET https://www.nseindia.com/api/ipo-bid-master`

**Headers:**
- `Accept`: `application/json, text/plain, */*`
- `Referer`: `https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids`
- `User-Agent`: (Standard browser User-Agent string)

**Response Structure:**
The response is a JSON array of strings containing the IPO symbols.
```json
[
  "ABH",
  "ANNU",
  "AUGMONT",
  "ESDS",
  "FASCINATE",
  "GAJA"
]
```

---

## 2. Fetch Allotment Status API

This API fetches the allotment details for a given IPO symbol and PAN number / Application number.

**Endpoint:**
`POST https://www.nseindia.com/api/ipo-bid-verification-details`

**Headers:**
- `Content-Type`: `application/json`
- `Referer`: `https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids`
- `User-Agent`: (Standard browser User-Agent string)

**Request Body (JSON):**
```json
{
  "symbol": "SYMBOL",
  "pan_no": "ABCDE1234F",
  "application_no": "BASE64_ENCODED_APP_NUMBER",
  "urlType": "ipo",
  "recaptcha": "RECAPTCHA_V3_TOKEN"
}
```
*Note: `application_no` needs to be Base64 encoded before sending in the payload. Provide either `pan_no` or `application_no`.*

**Response Structure:**
The response will indicate success or error. 
```json
{
  "errorCode": "0",
  "data": [
    {
      "symbol": "SYMBOL",
      "category": "IND",
      "appNumber": "APP_NUMBER",
      "refNumber": "REF_NO",
      "id": "DP_ID_IP",
      "quantity": "QTY",
      "price": "PRICE",
      "amt": "AMOUNT",
      "transDate": "DATE",
      "modDate": "DATE"
    }
  ]
}
```
If the record is not found, `data` is returned as an empty array `[]`. If there is an error (like invalid PAN), `errorCode` will be `"1"` and `errorMessage` will contain the reason.

# IPO Registry Scrape Guide

Bypass NSE/BSE captcha → scrape direct from registry. No official public JSON API exist. Must scrape web forms.

## 1. link intime (mufg intime)
* **url:** `https://in.mpms.mufg.com/initial_offer/public-issues.html`
* **method:** web form post.
* **payload:** pan, app no, or dp/client id.
* **blocker:** basic bot protection / captcha.
* **action:** automate http post. parse html result for "allotted" or "not allotted".
* **registration no:** `INR000004058`

## 2. kfintech
* **url:** `https://ipostatus.kfintech.com/`
* **method:** web form post.
* **payload:** pan, app no, or demat account.
* **blocker:** image captcha.
* **action:** download captcha image. use ocr (like tesseract) to read text. send post request with captcha text + pan. parse html for allotted shares.
* **registration no:** `INR000000221`

## 3. bigshare services
* **url:** `https://ipo.bigshareonline.com/ipo_status.html`
* **method:** web form post.
* **payload:** pan, app no, or beneficiary id.
* **blocker:** basic captcha / high traffic timeouts.
* **action:** automate post request. handle 503 timeouts during peak. parse html for "pending", "allotted", "not allotted".
* **registration no:** `INR000001385`

## 4. purva sharegistry
* **url:** `https://www.purvashare.com/investor-service/ipo-query`
* **method:** web form post.
* **payload:** pan or app no.
* **blocker:** minimal.
* **action:** direct http post. parse html table for status.
* **registration no:** `INR000001112`

## 5. cameo corporate services
* **url:** `https://ipostatus.cameoindia.com/` (or via `online.cameoindia.com`)
* **method:** web form post.
* **payload:** pan, app no, or dp/client id.
* **blocker:** recaptcha / basic validation.
* **action:** automate http post, bypass captcha if present, parse html.
* **registration no:** `INR000003753`

## 6. skyline financial services
* **url:** `https://www.skylinerta.com/ipo.php`
* **method:** web form post.
* **payload:** pan or app no.
* **blocker:** basic.
* **action:** http post. parse html.
* **registration no:** `INR000003241`

## summary
no clean json api. all need html parse. kfintech need ocr. link intime + bigshare need form automation. cameo/purva/skyline handle sme/smaller ipos, similar post + scrape approach. use python `requests` + `beautifulsoup` + `pytesseract`.



## 7. 3i infotech ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000001773`

## 8. aarthi consultants pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000379`

## 9. abhipra capital ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003829`

## 10. abs consultant pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000001286`

## 11. accurate securities & registry pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004173`

## 12. adroit corporate services pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000002227`

## 13. alankit assignments ltd
* **url:** `https://ipo.alankit.com/Query/GetQueryResult`
* **method:** `POST`
* **payload:** `JSON `{"CompCode":"<CompCode>","SearchParam":"PANNO","SearchValue":"<PAN>"}``
* **blocker:** `Client-side only Captcha (can be bypassed)`
* **action:** `Direct HTTP POST to API endpoint. Parse JSON response.`
* **registration no:** `INR000002532`

## 14. ankit consultancy pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000767`

## 15. b.c. debata & associates
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004255`

## 16. beacon investor holdings pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004468`

## 17. beetal financial & computer services pvt ltd
* **url:** `https://beetal.in/wp-admin/admin-ajax.php`
* **method:** `POST`
* **payload:** `company_isin, form2_radio_option, form2-dynamic-value-field`
* **blocker:** `OTP Verification`
* **action:** `Requires OTP verification, difficult to automate without manual intervention.`
* **registration no:** `INR000000262`

## 18. bgse financials ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004041`

## 19. bts consultancy services pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR200004031`

## 20. canbank computer services ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003621`

## 21. cdsl ventures ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004200`

## 22. cil securities ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000002276`

## 23. computech sharecap ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003647`

## 24. computer age management services (cams)
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000002813`

## 25. cybrilla technologies pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004404`

## 26. data software research company
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000403`

## 27. datamatics business solutions ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000874`

## 28. elevate fintech pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004431`

## 29. evermore stock brokers pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004529`

## 30. freedom registry limirws
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003563`

## 31. gnsa infotech pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003967`

## 32. goldvistas investor services private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004228`

## 33. harmilap share trasfer agents
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004334`

## 34. horizon financial consultants private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004486`

## 35. indo money securites private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004291`

## 36. indus portfolio private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003845`

## 37. integrated registry management service private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000544`

## 38. gnsa infotech pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR200003967`

## 39. itc limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR300000061`

## 40. jupiter corporate services limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003555`

## 41. lml limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000001666`

## 42. maashitla securities private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004370`

## 43. maheshwari datamatics private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000353`

## 44. mas services limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000049`

## 45. mcs share transfer agent ltd.
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004108`

## 46. mf utilities india pvt. ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004157`

## 47. mindex capital market private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004307`

## 48. mudra rta ventures private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004413`

## 49. nagarjuna fertilizers and chemicals limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR200004114`

## 50. nextgen share registry private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004422`

## 51. niche technologies private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003290`

## 52. nsdl database management limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004181`

## 53. nuvama clearing services limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004501`

## 54. o j financial services ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004459`

## 55. oneplus rta services private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004389`

## 56. orbis financial corporation limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004219`

## 57. pushpak financial services pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004477`

## 58. r & d infotech pvt ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003985`

## 59. rcmc share registry pvt ltd.
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000429`

## 60. regnum capital advisors private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004316`

## 61. religare broking limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004361`

## 62. rudra finserv private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004538`

## 63. s.k. infosolutions pvt.ltd.
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003886`

## 64. sabi viniyog private ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004025`

## 65. sag infotech private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004246`

## 66. sarthak global limited (formerly avanti finance ltd.)
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000002441`

## 67. satellite corporate services private ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003639`

## 68. shriram insight share brokers limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004132`

## 69. ski capital services limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004237`

## 70. sps share brokers private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004282`

## 71. system support services
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000502`

## 72. trustlink investor services private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004510`

## 73. uti infrastructure technology and services ltd. (formerly uti technology services ltd.)
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000001211`

## 74. validus fintech services private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004398`

## 75. venture capital and corporate investments ltd
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000001203`

## 76. evidatum solutions private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004495`

## 77. wayne secure digital rta private limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000004343`

## 78. xl softech systems ltd.
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000000254`

## 79. zuari finserv limited
* **url:** `Unknown`
* **method:** `Unknown`
* **payload:** `Unknown`
* **blocker:** `Unknown`
* **action:** `Unknown`
* **registration no:** `INR000003902`


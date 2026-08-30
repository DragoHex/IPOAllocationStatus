const fs = require('fs');
const https = require('https');

const chunks = [
"chunk-25IYX6UW.js","chunk-36AGECNH.js","chunk-3GD7O3JV.js","chunk-3ZHJTSPM.js",
"chunk-5MHTF6GL.js","chunk-5U3PJGQK.js","chunk-5WW7DYL6.js","chunk-67BBQQMC.js",
"chunk-6PN7LYKA.js","chunk-7KLEQ2PY.js","chunk-7QGVG4GA.js","chunk-AK7VNEYP.js",
"chunk-AKQPE63N.js","chunk-BQ3SVCIZ.js","chunk-CZ3D7TNP.js","chunk-DDZ2EFYL.js",
"chunk-EBKDD2MO.js","chunk-EUOWJAVN.js","chunk-G32FMWO3.js","chunk-HJK3ATBW.js",
"chunk-I4DPIHBY.js","chunk-IIVKBXOV.js","chunk-J6IA7B56.js","chunk-KQCAEI3Y.js",
"chunk-LJHZQ6TH.js","chunk-MFFLFG5Q.js","chunk-NIFH7X5G.js","chunk-NX3E56OQ.js",
"chunk-ODWJNLZC.js","chunk-OGMYEM7X.js","chunk-OLLEED6U.js","chunk-OLT3U3ZB.js",
"chunk-OR3V5A7V.js","chunk-OS5UCOFG.js","chunk-PPQMPLGF.js","chunk-R3I2FO5Q.js",
"chunk-RIXZVSAK.js","chunk-SAOICSZZ.js","chunk-UFZGTHHJ.js","chunk-UXIURXIA.js",
"chunk-VDPTDO3C.js","chunk-VHQGBLLY.js","chunk-XUTQK7PR.js"
];

async function fetchChunk(chunk) {
  return new Promise((resolve) => {
    https.get(`https://www.bseindia.com/assets/includenew/js/${chunk}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
  });
}

(async () => {
  for (let chunk of chunks) {
    const text = await fetchChunk(chunk);
    if (text.includes('Status of Issue Application')) {
      console.log(`Found in ${chunk}`);
      const matches = text.match(/\/api\/[a-zA-Z0-9_\-]+/g);
      if (matches) {
        console.log("APIs:", matches);
      }
      const bseApi = text.match(/https:\/\/api\.bseindia\.com[^\"]+/g);
      if (bseApi) {
        console.log("BSE APIs:", bseApi);
      }
      const allUrls = text.match(/https:\/\/[^\"]+/g);
      if (allUrls) {
        console.log("All URLs:", allUrls.filter(u => u.includes('api')));
      }
    }
  }
})();
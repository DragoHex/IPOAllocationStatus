async function getKFintechIPOs() {
    const htmlResp = await fetch('https://ipostatus.kfintech.com/');
    const html = await htmlResp.text();
    const jsMatch = html.match(/src="(\.?\/static\/js\/main\.[^"]+\.js)"/);
    if (!jsMatch) {
       console.log("JS file not found");
       return;
    }
    const jsUrl = jsMatch[1].replace(/^\./, 'https://ipostatus.kfintech.com');
    const jsResp = await fetch(jsUrl);
    const jsText = await jsResp.text();
    const jsonMatch = jsText.match(/JSON\.parse\('(\[{"clientId":.*?\])'\)/);
    if (jsonMatch) {
       const ipos = JSON.parse(jsonMatch[1]);
       console.log("KFintech IPOs:", ipos.slice(0, 3));
       return ipos;
    }
    console.log("JSON not found in JS");
}
getKFintechIPOs();

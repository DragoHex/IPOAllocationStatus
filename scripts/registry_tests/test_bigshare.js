async function test() {
    const r1 = await fetch('https://ipo.bigshareonline.com/Captcha.ashx');
    const cData = await r1.json();
    console.log(cData.token, cData.image ? "hasImage" : "no image");
}
test();

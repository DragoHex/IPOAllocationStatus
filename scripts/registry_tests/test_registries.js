async function testBigshare() {
    try {
        console.log("Testing Bigshare...");
        const res = await fetch('https://ipo.bigshareonline.com/IPO_Status.html');
        console.log("Bigshare status:", res.status);
    } catch(e) { console.log("Bigshare failed:", e.message); }
}

async function testPurva() {
    try {
        console.log("\nTesting Purva...");
        const res = await fetch('https://www.purvashare.com/investor-service/ipo-query');
        console.log("Purva status:", res.status);
    } catch(e) { console.log("Purva failed:", e.message); }
}

async function testCameo() {
    try {
        console.log("\nTesting Cameo...");
        const res = await fetch('https://ipostatus.cameoindia.com/');
        console.log("Cameo status:", res.status);
    } catch(e) { console.log("Cameo failed:", e.message); }
}

async function testSkyline() {
    try {
        console.log("\nTesting Skyline...");
        const res = await fetch('https://www.skylinerta.com/ipo.php');
        console.log("Skyline status:", res.status);
    } catch(e) { console.log("Skyline failed:", e.message); }
}

async function testAlankit() {
    try {
        console.log("\nTesting Alankit...");
        const res = await fetch('https://ipo.alankit.com/Query/GetQueryResult', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({CompCode: "TEST", SearchParam: "PANNO", SearchValue: "DGLPP2586J"})
        });
        console.log("Alankit status:", res.status);
    } catch(e) { console.log("Alankit failed:", e.message); }
}

testBigshare().then(testPurva).then(testCameo).then(testSkyline).then(testAlankit);

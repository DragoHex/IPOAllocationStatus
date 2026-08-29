const types = ['IPO', 'ipo', 'IPOLIST', 'issues', 'issue'];
async function test() {
    for (const t of types) {
        const u = `https://0uz601ms56.execute-api.ap-south-1.amazonaws.com/prod/api/query?type=${t}`;
        try {
            const resp = await fetch(u, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({})
            });
            console.log("POST", t, resp.status, await resp.text());
        } catch(e) {}
    }
}
test();

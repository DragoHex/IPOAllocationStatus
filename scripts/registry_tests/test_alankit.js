async function test() {
    const res = await fetch('https://ipo.alankit.com/Query/companylist');
    console.log(res.status, await res.text());
}
test();

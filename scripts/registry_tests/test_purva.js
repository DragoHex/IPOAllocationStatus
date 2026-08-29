async function test() {
    const res = await fetch('https://www.purvashare.com/investor-service/ipo-query');
    const text = await res.text();
    console.log(text.match(/<select[\s\S]*?<\/select>/ig));
}
test();

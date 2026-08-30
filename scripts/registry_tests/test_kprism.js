async function test() {
    const resp = await fetch('https://kprism.kfintech.com/ipostatus/js/main.js?q=20220210');
    const text = await resp.text();
    console.log(text.match(/(https?:\/\/[^\s"']+)/g));
}
test();

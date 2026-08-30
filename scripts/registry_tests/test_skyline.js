async function test() {
    const formData = new URLSearchParams();
    formData.append('company', '4175');
    
    // Step 1: POST to get form with CSRF token and cookie (since it seems it needs a post to initialize session)
    const res1 = await fetch('https://www.skylinerta.com/display_application.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
    const html1 = await res1.text();
    const csrfMatch = html1.match(/name="csrf_token" id="csrf_token" value="([^"]+)"/);
    if (!csrfMatch) return console.log("No CSRF token found");
    
    const cookies = res1.headers.get('set-cookie');
    
    // Step 2: POST the actual request with same session cookie
    const formData2 = new URLSearchParams();
    formData2.append('client_id', '');
    formData2.append('application_no', '');
    formData2.append('pan', 'DGLPP2586J');
    formData2.append('csrf_token', csrfMatch[1]);
    formData2.append('company', '4175');
    formData2.append('action', 'search');
    
    const res2 = await fetch('https://www.skylinerta.com/display_application.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies 
        },
        body: formData2.toString(), 
    });
    
    const html2 = await res2.text();
    const errorMatch = html2.match(/class="error_message">([\s\S]*?)<\/p>/);
    if (errorMatch) {
       console.log("Error:", errorMatch[1].trim());
    } else {
       console.log(html2.substring(html2.indexOf('<div class=\"centersec\">'), html2.indexOf('<div class=\"centersec\">') + 2000));
    }
}
test();

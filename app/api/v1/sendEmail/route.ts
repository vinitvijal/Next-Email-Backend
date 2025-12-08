

export async function GET(request: Request) {
    // console.log(request.headers.get('host'));
    return new Response("Send Email GET endpoint is working!");
}


export async function POST(request: Request) {
    const res = await request.text();
    const to = request.headers.get('to');
    const subject = request.headers.get('subject');
    const body = request.headers.get('body');
    const host = request.headers.get('host');
    const port = request.headers.get('port');
    const method = request.headers.get('method');
    const username = request.headers.get('user');
    const password = request.headers.get('pass');

    if (!to || !subject || !body) {
        return new Response("Missing required email fields", { status: 400 });
    }

    if (!host || !port || !method || !username || !password) {
        return new Response("Missing required SMTP configuration", { status: 400 });
    }

    



    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log(res)
    return new Response("Email sent successfully!");
}
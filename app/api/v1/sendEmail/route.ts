

export async function GET(request: Request) {
    // console.log(request.headers.get('host'));
    return new Response("Send Email GET endpoint is working!");
}


export async function POST(request: Request) {
    const res = await request.text();
    const to = request.headers.get('to');
    const subject = request.headers.get('subject');
    const body = request.headers.get('body');
    // Here you would integrate with an email service provider to send the email.
    // For demonstration purposes, we'll just log the email details.
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log(res)
    return new Response("Email sent successfully!");
}
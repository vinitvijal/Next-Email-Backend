import Nodemailer from 'nodemailer';



export async function GET(request: Request) {
    // console.log(request.headers.get('host'));
    return new Response("Send Email GET endpoint is working!");
}


export async function POST(request: Request) {
    const body = await request.text();
    const to = request.headers.get('to');
    const subject = request.headers.get('subject');
    const host = request.headers.get('host');
    const port = request.headers.get('port');
    const method = request.headers.get('method');
    const username = request.headers.get('user');
    const password = request.headers.get('pass');
    const from = request.headers.get('from');



    if (!to || !subject || !from) {
        console.log(to, subject, from)
        return new Response("Missing required email fields", { status: 400 });
    }

    if (!host || !port || !method || !username || !password) {
        return new Response("Missing required SMTP configuration", { status: 400 });
    }


    const transporter = Nodemailer.createTransport({
        host: host,
        port: parseInt(port),
        secure: method === 'SSL', // true for 465, false for other ports
        auth: {
            user: username,
            pass: password,
        },
    });


    

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    


    const info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: body, // plain‑text body
        // html: `${body}` // HTML body
    });

    
    
    console.log("Message sent:", info);

    return new Response("Email sent successfully!");
}
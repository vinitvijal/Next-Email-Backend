import { getApiData } from '@/app/actions/api';
import { prisma } from '@/lib/prisma';
import Nodemailer from 'nodemailer';



export async function GET(request: Request) {
    // console.log(request.headers.get('host'));
    return new Response("Send Email GET endpoint is working!");
}


export async function POST(request: Request) {
    const bearer = request.headers.get('authorization');
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Get the API key from the Bearer token
    const apiKey = bearer.split(' ')[1];


    // Validate and get API data
    const apiData = await getApiData(apiKey);

    if (!apiData) {
        return new Response("Invalid API Key", { status: 403 });
    }

    if (!apiData.user){
        return new Response("User not found for the provided API Key", { status: 403 });
    }

    if (!apiData.user.wallet || apiData.user.wallet.balanceCredits <= 0) {
        return new Response("Insufficient credits to send email", { status: 402 });
    }

    if (apiData.user.wallet.balanceCredits < 1) {
        return new Response("Not enough credits to send email", { status: 402 });
    }

    // Deduct one credit for sending an email
    await prisma.wallet.updateMany({
        where: { userId: apiData.user.id },
        data: {
            balanceCredits: {
                decrement: 1,
            },
        },
    });



    const body = await request.text();
    const to = request.headers.get('to');
    const subject = request.headers.get('subject');
    const host = request.headers.get('host-url');
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
        console.log(host, port, method, username, password)
        return new Response("Missing required SMTP configuration", { status: 400 });
    }


    const transporter = Nodemailer.createTransport({
        host: host,
        port: parseInt(port),
        secure: method === "SSL", // true for 465, false for other ports
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
        html: body, // plain‑text body
        // html: `${body}` // HTML body
    });


    
    await prisma.emails.create({
        data: {
            userId: apiData.user.id,
            to: to,
            from: from,
            subject: subject,
            requestId: info.messageId || 'Failed to get messageId',
            status: info.accepted.length > 0 ? 'SENT' : 'FAILED',
            apiKeyId: apiData.id,
            isHtml: true,
        },
    });



    await prisma.emails.create({
        data: {
            userId: apiData.user.id,
            to: to,
            from: from,
            subject: subject,
            requestId: info.messageId || 'Failed to get messageId',
            status: info.accepted.length > 0 ? 'SENT' : 'FAILED',
            apiKeyId: apiData.id,
            isHtml: true,
        },
    });



    if (!info.messageId) {
        return new Response("Failed to send email", { status: 500 });
    }


    

    // console.log("Message sent:", info);

    return new Response(JSON.stringify({"message": "Email sent successfully!", "messageId": info.messageId}));
}
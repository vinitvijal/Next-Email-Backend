export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4">
      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-16 text-center sm:py-24">
        <h1 className="bg-linear-to-br from-sky-500 to-blue-600 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl">
          Nodemailer Alternative for Cloudflare
        </h1>
        <p className="max-w-2xl text-balance text-lg text-zinc-700 dark:text-zinc-300">
          TypeScript-first Mail SDK that works natively on Cloudflare Workers. No SMTP, no servers. Free for the first 1,000 mails every month.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#pricing"
            className="rounded-full bg-foreground px-5 py-2.5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Get API Keys
          </a>
          <a
            href="#code"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Try the SDK
          </a>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>⚡ Works on Cloudflare</span>
          <span>🟦 TypeScript support</span>
          <span>🔒 Secure API keys</span>
          <span>💸 Free 1k/month</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Cloudflare-native",
            desc: "Send emails from Workers without SMTP or servers.",
            icon: "🌤️",
          },
          {
            title: "TypeScript-first",
            desc: "Typed SDK, great DX, auto-complete everywhere.",
            icon: "🟦",
          },
          {
            title: "Simple API keys",
            desc: "Sign in, create project, copy keys – done.",
            icon: "🔑",
          },
          {
            title: "Reliable delivery",
            desc: "Queues + retries keep your emails moving.",
            icon: "📬",
          },
          {
            title: "HTML + templates",
            desc: "Send plain text, rich HTML, or template payloads.",
            icon: "🧩",
          },
          {
            title: "Generous free tier",
            desc: "1,000 mails every month at no cost.",
            icon: "🎁",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Code Example */}
      <section id="code" className="py-12">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Send your first email</h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">TypeScript • Cloudflare Workers</span>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-black p-4 text-sm text-zinc-100"><code>{`// npm install email-sdk
import { QodeMLClient } from "email-sdk";

const client = new QodeMLClient({
    host: "smtp.office365.com",
    port: 587, 
    method: "PLAIN",
    username: "USERNAME",
    password: "PASSWORD",
    useSsl: true,
    apiKey: "YOUR_API_KEY",
}); 

await client.sendEmail({
        to: "email@gmail.com",
        from: "info@qodeml.com",
        subject: "Thank you for contacting us",
        body: "Hello User,\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest Regards,\nQodeML Team",
        isHtml: false,
    })
// Works without Nodemailer, perfect for Cloudflare Workers
`}</code></pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Simple, predictable pricing</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Best for development and small projects.</p>
            <div className="my-4 text-4xl font-extrabold">$0</div>
            <ul className="mb-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>• 1,000 mails / month</li>
              <li>• TypeScript SDK</li>
              <li>• API key access</li>
              <li>• Basic analytics</li>
            </ul>
            <a href="#signin" className="inline-block rounded-full bg-foreground px-4 py-2 text-background">Start Free</a>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Scale confidently with advanced features.</p>
            <div className="my-4 text-4xl font-extrabold">Pay as you go</div>
            <ul className="mb-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>• Higher limits</li>
              <li>• Priority delivery</li>
              <li>• Webhooks & templates</li>
              <li>• Detailed analytics</li>
            </ul>
            <a href="#contact" className="inline-block rounded-full border border-zinc-300 px-4 py-2 dark:border-zinc-600">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold">Ship emails from Cloudflare in minutes</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
          Sign in, create your account, copy your API keys, and start sending with our SDK. No Nodemailer, no servers.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="#signin" className="rounded-full bg-foreground px-5 py-2.5 text-background">Sign In</a>
          <a href="#docs" className="rounded-full border border-zinc-300 px-5 py-2.5 dark:border-zinc-600">Read Docs</a>
        </div>
      </section>
    </main>
  );
}

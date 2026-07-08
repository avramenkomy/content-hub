import nodemailer from 'nodemailer';

type ContactEmailInput = {
  name: string,
  email: string,
  subject: string,
  message: string,
}


function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.CONTACT_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL
  );
}


export async function sendContactEmail(input: ContactEmailInput) {
  if (!hasSmtpConfig()) {
    console.log('SMTP is not configured. Contact message ws saved only.');

    return {
      skipped: true,
    }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: input.email,
    subject: `[Content Hub] ${input.subject}`,
    text: `
      New contact message from Content Hub

      Name: ${input.name}
      Email: ${input.email}
      Subject: ${input.subject}

      Message:
      ${input.message}`.trim(),
    html: `
      <div>
        <h2>New contact message from Content Hub</h2>
        <p><strong>Name:</strong>${input.name}</p>
        <p><strong>Email:</strong>${input.email}</p>
        <p><strong>Subject:</strong>${input.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, "<br />")}</p>
      </div>
    `
  });

  return {
    skipped: false,
  }
}
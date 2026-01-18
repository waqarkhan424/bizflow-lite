import { resend } from "@/lib/resend";

export async function sendResetPasswordEmail(params: {to: string; resetLink: string;}) {
    
  const { to, resetLink } = params;

  const from = process.env.RESEND_FROM;
  if (!from) throw new Error("Missing RESEND_FROM in env");

  await resend.emails.send({
    from,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Reset your password</h2>
        <p>Click this link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 30 minutes.</p>
      </div>
    `,
  });
}

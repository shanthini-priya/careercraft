/**
 * External service adapters (email, payments, storage).
 *
 * Each service reads its API key from environment variables. When a key is
 * not configured (e.g. local development), the adapter falls back to a
 * local stub so the rest of the app keeps working. Replace the stub bodies
 * with real provider calls when you add your keys.
 */

// ─── Email (transactional) ────────────────────────────────────────────────
// Providers: Resend / SendGrid / Nodemailer. Add RESEND_API_KEY to .env.
export async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email:stub] to=${to} subject="${subject}"`);
    return { ok: true, stub: true };
  }
  // const res = await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ from: "onboarding@careercraft.dev", to, subject, html }),
  // });
  // return { ok: res.ok };
  return { ok: true, stub: true };
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to CareerCraft 🎉",
    html: `<p>Hi ${user.name},</p><p>Welcome to CareerCraft — your career, crafted by AI.</p>`,
    text: `Hi ${user.name},\nWelcome to CareerCraft!`,
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────
// Provider: Razorpay (India) or Stripe. Add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET.
export async function createPaymentOrder({ amount, currency = "INR", receipt }) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return { stub: true, orderId: "order_stub_" + Date.now().toString(36), amount, currency };
  }
  // const basic = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  // const res = await fetch("https://api.razorpay.com/v1/orders", {
  //   method: "POST",
  //   headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ amount: Math.round(amount * 100), currency, receipt }),
  // });
  // return res.json();
  return { stub: true, orderId: "order_stub_" + Date.now().toString(36), amount, currency };
}

// ─── File storage ────────────────────────────────────────────────────────
// Provider: Cloudinary / AWS S3 / Supabase Storage. Add CLOUDINARY_URL.
export async function uploadFile(buffer, { folder = "careercraft" }) {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) {
    return { stub: true, url: null, publicId: null };
  }
  // const form = new FormData();
  // form.append("file", buffer);
  // form.append("folder", folder);
  // form.append("upload_preset", "unsigned");
  // const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/image/upload`, {
  //   method: "POST",
  //   body: form,
  // });
  // return res.json();
  return { stub: true, url: null, publicId: null };
}

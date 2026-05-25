import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const ADMIN_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!;
const WELCOME_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME!;

export interface RegistrationPayload {
  name: string;
  email: string;
  phone: string;
}

export async function sendRegistrationEmails(
  data: RegistrationPayload,
): Promise<void> {
  const payload = {
    from_name: data.name,
    from_email: data.email,
    to_email: data.email,
    phone: data.phone,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  const [admin, welcome] = await Promise.allSettled([
    emailjs.send(SERVICE_ID, ADMIN_TEMPLATE, payload, PUBLIC_KEY),
    emailjs.send(SERVICE_ID, WELCOME_TEMPLATE, payload, PUBLIC_KEY),
  ]);

  if (admin.status === "rejected") {
    console.error("[EmailJS] Admin notification failed:", admin.reason);
  }
  if (welcome.status === "rejected") {
    console.error("[EmailJS] Welcome email failed:", welcome.reason);
  }

  // If both failed, surface the error to the caller
  if (admin.status === "rejected" && welcome.status === "rejected") {
    throw new Error("Failed to send registration emails.");
  }
}

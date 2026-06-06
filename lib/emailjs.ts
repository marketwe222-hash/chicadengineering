const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const ADMIN_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!;
const WELCOME_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME!;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY!; // ← add this
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";
const WEBSITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://www.chicad-es.com";
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "chicad-es@gmail.com";

export interface RegistrationPayload {
  name: string;
  email: string;
  phone: string | null;
  studentId: string;
  password: string;
  courseName: string;
  adminEmails?: string[];
}

async function sendEmailWithTemplate(
  templateId: string,
  templateParams: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: templateId,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY, // ← add this
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `EmailJS request failed (${response.status}): ${body ?? response.statusText}`,
    );
  }
}

export async function sendRegistrationEmails(
  data: RegistrationPayload,
): Promise<void> {
  const welcomeParams = {
    student_name: data.name,
    student_email: data.email,
    phone: data.phone ?? "N/A",
    student_id: data.studentId,
    password: data.password,
    course_name: data.courseName,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    website_url: WEBSITE_URL,
    support_email: SUPPORT_EMAIL,
    to_email: data.email,
  };

  const adminParamBase = {
    student_name: data.name,
    student_email: data.email,
    phone: data.phone ?? "N/A",
    student_id: data.studentId,
    course_name: data.courseName,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  const emailRequests = [
    sendEmailWithTemplate(WELCOME_TEMPLATE, welcomeParams),
  ];

  if (data.adminEmails?.length) {
    // Normalize (trim + lowercase) and dedupe admin emails to avoid duplicate sends
    const normalized = data.adminEmails
      .filter(Boolean)
      .map((e) => String(e).trim().toLowerCase());

    const uniqueAdminEmails = Array.from(new Set(normalized));

    console.debug(
      "[EmailJS] Sending admin notifications to:",
      uniqueAdminEmails,
    );

    uniqueAdminEmails.forEach((adminEmail) => {
      emailRequests.push(
        sendEmailWithTemplate(ADMIN_TEMPLATE, {
          ...adminParamBase,
          to_email: adminEmail,
        }),
      );
    });
  }

  const results = await Promise.allSettled(emailRequests);

  const welcomeResult = results[0];
  const adminResults = results.slice(1);

  if (welcomeResult.status === "rejected") {
    console.error("[EmailJS] Welcome email failed:", welcomeResult.reason);
  }

  if (adminResults.length > 0) {
    adminResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `[EmailJS] Admin notification failed for recipient ${
            data.adminEmails?.[index] ?? "unknown"
          }:`,
          result.reason,
        );
      }
    });
  }

  if (
    welcomeResult.status === "rejected" &&
    adminResults.every((result) => result.status === "rejected")
  ) {
    throw new Error("Failed to send registration emails.");
  }
}

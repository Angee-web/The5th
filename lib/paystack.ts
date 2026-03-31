const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE = "https://api.paystack.co";

export async function initializePayment(data: {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function verifyPayment(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  return res.json();
}

export function generateReference() {
  return `5TH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

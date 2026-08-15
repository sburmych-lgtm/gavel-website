/**
 * The contact adapter — the single seam between this frontend and a future
 * backend. Connecting a real API means replacing the body of submitContact()
 * and nothing else.
 *
 * Today it reports that no endpoint exists and hands back the trainer's own
 * channels, which is what the UI routes to. It never returns success. A form
 * that silently discards a lead is worse than no form, and a fake "Надіслано!"
 * is worse than both.
 *
 * Contract for the real endpoint: docs/architecture/09_FINAL_BACKEND_API_ARCHITECTURE.md
 */
import { site } from "../content";

export type ContactPayload = {
  name: string;
  goal: string;
  contact: string;
};

export type ContactResult =
  | { ok: true; channel: "api" }
  | { ok: false; reason: "no-endpoint"; channels: { telegram: string; instagram: string } }
  | { ok: false; reason: "validation"; fields: Record<string, string> };

export function validate(p: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!p.name?.trim()) errors.name = "Вкажіть ім'я";
  if (!p.goal?.trim()) errors.goal = "Опишіть коротко вашу ціль";
  if (!p.contact?.trim()) errors.contact = "Вкажіть, як з вами зв'язатися";
  return errors;
}

export async function submitContact(
  p: ContactPayload,
): Promise<ContactResult> {
  const errors = validate(p);
  if (Object.keys(errors).length) {
    return { ok: false, reason: "validation", fields: errors };
  }

  // No endpoint exists yet. The UI hands off to the trainer's own channels.
  return {
    ok: false,
    reason: "no-endpoint",
    channels: { telegram: site.telegram, instagram: site.instagram },
  };
}

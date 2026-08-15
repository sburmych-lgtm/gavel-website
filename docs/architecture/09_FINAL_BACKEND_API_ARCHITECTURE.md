# 09 · BACKEND AND API ARCHITECTURE

**Nothing backend is built in this run.** This document exists so that when a
backend is built, the frontend does not have to be redesigned around it.

## Current boundary

| Frontend owns | Backend will own |
|---|---|
| Rendering, routing, responsive layout | Lead submission and storage |
| Content and media | CRM integration |
| Motion and interaction | Scheduling, if selected |
| SEO markup and JSON-LD | Anti-spam and server validation |
| Before/After interaction | Optional CMS for content |
| Contact form UI and client validation | Transactional email |

## The contact adapter

All contact behaviour goes through one module, `src/lib/contact.ts`, which
exports a single function behind a stable type:

```ts
export type ContactPayload = {
  name: string;
  goal: string;
  contact: string;      // whatever the visitor prefers to be reached on
};

export type ContactResult =
  | { ok: true; channel: "api" }
  | { ok: false; reason: "no-endpoint"; fallbackUrl: string };

export async function submitContact(p: ContactPayload): Promise<ContactResult>;
```

In the prototype the implementation returns `{ ok: false, reason: "no-endpoint" }`
with the Instagram URL, and the UI says so plainly. **It never renders a success
state.** A form that silently discards a lead is worse than no form, and a fake
"Надіслано!" is worse than both.

Connecting a real backend means replacing the body of that one function. No
component changes.

## Future API contract

Versioned from the first day so the frontend can pin.

```
POST /api/v1/leads
Content-Type: application/json

{ "name": string(1..80),
  "goal": string(1..600),
  "contact": string(1..120),
  "source": "website",
  "locale": "uk" }

201 { "ok": true, "id": string }
400 { "ok": false, "error": "validation", "fields": { [k]: string } }
429 { "ok": false, "error": "rate_limited", "retryAfter": number }
5xx { "ok": false, "error": "server" }
```

Requirements for whoever implements it: server-side validation independent of
the client, rate limiting per IP, a spam control that is not a CAPTCHA the
visitor has to solve, and a stored `createdAt` with the source. Success is shown
only on a real `201`.

## Deliberately not built now

CRM, booking and calendar, payments, authentication, a CMS, analytics, email
automation. Each is a real project decision with a cost, and none of them can be
specified honestly before the client has confirmed how leads actually reach him
today.

## Hosting

Static output served by Railway. No server runtime is required for the
prototype. When the API arrives it should be a separate service behind
`/api/*` rather than converting the site to SSR — the page has no per-request
content, and giving up static rendering would cost the SEO position described in
`13` for no gain.

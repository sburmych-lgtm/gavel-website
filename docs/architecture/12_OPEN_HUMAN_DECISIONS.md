# 12 · OPEN HUMAN DECISIONS

None of these block the prototype. All of them block production. Each has a
recommendation so the decision is a yes/no rather than an essay.

---

### H-01 · Consent for `Fitness_traine_girl.mp4`

The only real coach-with-client footage in the library, and the one asset that
would show coaching actually happening rather than a coach standing still. It
shows an identifiable third party.

The brief's rule that client-supplied content is approved covers *Igor's
statements about himself*. A third party's likeness on a public URL is a
different category, so the rule does not settle it.

**Recommendation:** get written consent, then ship it in the Method section —
it is genuinely the missing piece there. Not shipped until then.

---

### H-02 · Consent scope for `3_before-after.jpg`

Ships as supporting proof. It shows an identifiable face and carries burnt-in
«ДО»/«ПІСЛЯ» labels, which strongly suggests it was composed for publication.

**Recommendation:** confirm the consent covers web use. If not, drop it — the
other three composites carry the section without it.

---

### H-03 · Real domain

Canonical URL, sitemap host, OG absolute URLs and the `noindex` flag are all
driven by one config value, currently the Railway preview host.

**Recommendation:** register the domain before production, then flip
`SITE_URL` and `INDEXABLE` together.

---

### H-04 · Training-crawler policy

`robots.txt` explicitly allows search and user-directed retrieval — Googlebot,
Google-Extended, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User,
PerplexityBot. The *training* crawlers `GPTBot` and `ClaudeBot` are left
unlisted, because allowing or blocking model training is the owner's call.

**Recommendation:** leave as-is unless the owner has a view. Search visibility
is unaffected either way.

---

### H-05 · Contact channel

No phone number or email exists in the dataset and none was invented. Instagram
`@gavel_man` is the only real channel, and the form says so.

**Recommendation:** decide whether a real form endpoint is wanted. If yes,
`09` has the contract; if no, remove the form and keep the Instagram action.

---

### H-06 · Pricing currency

The dataset mixes ₴ and $ — 600 ₴ for a single session, $100/$150/$200 monthly.
Published exactly as supplied with a caveat line. No conversion was invented.

**Recommendation:** confirm this is current, and confirm what "місяць" includes
in sessions per week. Unify the currency only if Igor wants it unified.

---

### H-07 · Scope wording on two services

Two dataset items are published narrower than written:

- «Реабілітація та фізіотерапія» → published as **реабілітаційний тренінг**
- «Підбір спортивного харчування та фармакології» → published as **підбір
  спортивного харчування** only

Both keep the page inside what a trainer can publicly advertise. Pharmacology
routes to consultation rather than appearing as a listed service.

**Recommendation:** keep. Change only after professional advice.

---

### H-08 · Typography substitution

Prior audits specified Fixel and e-Ukraine Head. Neither is reliably obtainable
— no npm package, no working repository archive. Shipped with Geologica, Onest
and JetBrains Mono, which satisfy every stated rule.

**Recommendation:** if the client wants Fixel specifically, supply the licensed
woff2 files and two custom properties change.

---

### H-09 · The dog

`FUN!!!Canoe-Dog.mp4` ships as a small footer easter egg. It is charming and it
is real, but it is a tone decision.

**Recommendation:** keep unless the client wants a strictly formal register.
Removing it is one line.

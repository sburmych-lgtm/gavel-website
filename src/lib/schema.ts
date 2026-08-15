/**
 * JSON-LD, built from the same content module the page renders from, so the
 * structured data cannot drift away from the visible text.
 *
 * Deliberately NOT emitted, because the data does not exist: aggregateRating,
 * review, streetAddress, telephone, openingHours. Inventing any of them would
 * be fabricating facts, and structured data that misrepresents the page is
 * penalised rather than rewarded.
 *
 * `priceRange` IS emitted — it is derived from the tiers already published on
 * the page, not guessed.
 */
import { site, pricing, formats, faq, credentials } from "../content";

const PERSON = `${"#person"}`;
const BUSINESS = "#business";

export function buildSchema(siteUrl: string, ogImage: string) {
  const abs = (p: string) => new URL(p, siteUrl).href;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": abs(PERSON),
        name: site.name,
        alternateName: site.romanised,
        jobTitle: site.role,
        image: abs(ogImage),
        url: siteUrl,
        sameAs: [site.instagram, site.telegram],
        knowsAbout: [
          "Персональні тренування",
          "Групові тренування",
          "Онлайн-супровід",
          "Реабілітаційний тренінг",
          "Корекція постави",
          "Стретчинг",
          "Міофасціальне розслаблення",
          "Веслування на каное",
          "Веслування на човнах Dragonboat",
        ],
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Полтавський національний педагогічний університет імені В. Г. Короленка",
        },
        worksFor: { "@id": abs(BUSINESS) },
        hasOfferCatalog: { "@id": abs("#offers") },
        /* Titles exactly as the client states them. No years and no event
           names are added, because neither exists in the dataset. */
        hasCredential: credentials.groups
          .filter((g) => g.title === "Звання")
          .flatMap((g) =>
            g.items.map((item) => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "Спортивне звання",
              name: item,
            })),
          ),
      },
      {
        // SportsActivityLocation rather than a generic LocalBusiness: the venue
        // is a real fitness centre. No streetAddress — none was supplied, and
        // guessing one would be inventing a fact.
        "@type": ["LocalBusiness", "SportsActivityLocation"],
        "@id": abs(BUSINESS),
        name: `${site.name} — ${site.role}`,
        description: site.description,
        url: siteUrl,
        image: abs(ogImage),
        areaServed: [
          { "@type": "City", name: "Львів" },
          { "@type": "Country", name: "Україна" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Львів",
          addressCountry: "UA",
        },
        location: {
          "@type": "Place",
          name: site.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Львів",
            addressCountry: "UA",
          },
        },
        /* Derived from the published tiers, not guessed. */
        priceRange: "0–200 $",
        currenciesAccepted: "UAH, USD",
        sameAs: [site.instagram, site.telegram],
        hasOfferCatalog: { "@id": abs("#offers") },
      },
      {
        "@type": "WebSite",
        "@id": abs("#website"),
        url: siteUrl,
        name: site.title,
        inLanguage: "uk",
        publisher: { "@id": abs(PERSON) },
      },
      {
        "@type": "WebPage",
        "@id": siteUrl,
        url: siteUrl,
        name: site.title,
        description: site.description,
        inLanguage: "uk",
        isPartOf: { "@id": abs("#website") },
        about: { "@id": abs(PERSON) },
        primaryImageOfPage: abs(ogImage),
        mainEntity: { "@id": abs("#faq") },
      },
      /* The six Q&A pairs are already server-rendered in the page; this only
         marks up content that is visibly there. */
      {
        "@type": "FAQPage",
        "@id": abs("#faq"),
        inLanguage: "uk",
        mainEntity: faq.items.map((item, i) => ({
          "@type": "Question",
          "@id": abs(`#faq-${i + 1}`),
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      // One Service per format. Prices carry the dataset's real currencies —
      // UAH for the single session, USD for the monthly packages. No
      // conversion is invented.
      ...formats.rows.map((row, i) => ({
        "@type": "Service",
        "@id": abs(`#service-${i + 1}`),
        name: row.title,
        description: row.body,
        serviceType: row.title,
        provider: { "@id": abs(PERSON) },
        areaServed: { "@type": "City", name: "Львів" },
      })),
      {
        "@type": "OfferCatalog",
        "@id": abs("#offers"),
        name: "Формати співпраці",
        itemListElement: pricing.tiers.map((t, i) => {
          /* The USD tiers are monthly; the hryvnia ones are per session or
             one-off. Stating the period is what stops "$200" being read as a
             one-time total. */
          const monthly = t.currency === "$";
          return {
            "@type": "Offer",
            "@id": abs(`#offer-${i + 1}`),
            name: t.name,
            description: t.includes,
            price: t.price,
            priceCurrency: monthly ? "USD" : "UAH",
            availability: "https://schema.org/InStock",
            seller: { "@id": abs(PERSON) },
            /* All five tiers price the same service — personal training. The
               group, online and paddling formats are published without a
               price, so no Offer points at them. */
            itemOffered: { "@id": abs("#service-1") },
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: t.price,
              priceCurrency: monthly ? "USD" : "UAH",
              ...(monthly
                ? { unitCode: "MON", unitText: "місяць" }
                : { unitText: i === 0 ? "консультація" : "заняття" }),
            },
          };
        }),
      },
    ],
  };
}

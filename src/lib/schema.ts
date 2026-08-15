/**
 * JSON-LD, built from the same content module the page renders from, so the
 * structured data cannot drift away from the visible text.
 *
 * Deliberately NOT emitted, because the data does not exist: aggregateRating,
 * review, streetAddress, telephone, openingHours, priceRange. Inventing any of
 * them would be fabricating facts, and structured data that misrepresents the
 * page is penalised rather than rewarded.
 */
import { site, pricing, formats } from "../content";

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
        sameAs: [site.instagram],
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
        location: { "@type": "Place", name: site.venue },
        sameAs: [site.instagram],
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
        itemListElement: pricing.tiers.map((t) => ({
          "@type": "Offer",
          name: t.name,
          description: t.includes,
          price: t.price,
          priceCurrency: t.currency === "₴" ? "UAH" : "USD",
          availability: "https://schema.org/InStock",
          seller: { "@id": abs(PERSON) },
        })),
      },
    ],
  };
}

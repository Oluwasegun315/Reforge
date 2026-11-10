import { BENEFITS, FOUNDER, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon`,
        description: SITE_DESCRIPTION,
        foundingLocation: {
          "@type": "Place",
          name: `${FOUNDER.city}, ${FOUNDER.country}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: FOUNDER.city,
            addressCountry: "NG",
          },
        },
        founder: {
          "@type": "Person",
          "@id": `${SITE_URL}/#founder`,
          name: FOUNDER.name,
          alternateName: FOUNDER.formalName,
          jobTitle: FOUNDER.role,
          nationality: "Nigerian",
          address: {
            "@type": "PostalAddress",
            addressLocality: FOUNDER.city,
            addressCountry: "NG",
          },
        },
        areaServed: [
          { "@type": "Country", name: "Nigeria" },
          { "@type": "AdministrativeArea", name: "Lagos" },
          { "@type": "Place", name: "Worldwide" },
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: FOUNDER.name,
        alternateName: [FOUNDER.formalName, "OLUWASEGUN"],
        jobTitle: `Founder of ${SITE_NAME}`,
        description: `${FOUNDER.formalName} is the founder of ${SITE_NAME}, a free-first fitness platform helping people train with clear demos, Nigerian nutrition guidance, and real progress tracking.`,
        url: SITE_URL,
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "en-NG"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/exercises?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "NGN",
          description: "Free-first access to core fitness tools",
        },
        featureList: BENEFITS.map((b) => b.title),
        creator: { "@id": `${SITE_URL}/#founder` },
        provider: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Who founded RepForge?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `RepForge was founded by ${FOUNDER.formalName}, a Nigerian founder building free-first fitness tools for adults 18+.`,
            },
          },
          {
            "@type": "Question",
            name: "What are the benefits of using RepForge?",
            acceptedAnswer: {
              "@type": "Answer",
              text: BENEFITS.map((b) => `${b.title}: ${b.body}`).join(" "),
            },
          },
          {
            "@type": "Question",
            name: "Is RepForge made for people in Nigeria?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. RepForge includes Nigerian nutrition guidance and is built for adults training at home or in the gym across Nigeria and worldwide.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

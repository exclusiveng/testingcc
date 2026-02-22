import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "360Urban — Verified Properties in Abuja",
  description = "Find verified houses, flats, duplexes, and land in Abuja. Area-based property listings with no agent stress. Rent, buy, or invest with confidence.",
  url = "https://360urban.ng",
  image = "/og-image.jpg",
  type = "website",
  jsonLd = null,
}) {
  const fullTitle = title.includes("360Urban") ? title : `${title} | 360Urban`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="360Urban" />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

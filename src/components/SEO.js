import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData = null,
}) => {
  const siteTitle = "Magestic - Premium Board Games Store";
  const siteDescription =
    "Discover premium board games at Magestic. Quality family games, strategy games, and party games with fast shipping across Australia.";
  const siteUrl = "https://magestic.com.au";
  const siteImage = "https://magestic.com.au/og-image.jpg";

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description || siteDescription;
  const finalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const finalImage = image || siteImage;

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    description: siteDescription,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta
        name="keywords"
        content={
          keywords ||
          "board games, family games, strategy games, party games, educational games, Australian board game store, premium games"
        }
      />
      <meta name="author" content="Magestic" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="AU" />
      <meta name="geo.placename" content="Australia" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Magestic" />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
      <meta property="twitter:site" content="@magesticgames" />

      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#8b1a1a" />
      <meta name="msapplication-TileColor" content="#8b1a1a" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      <script type="application/ld+json">
        {JSON.stringify(baseStructuredData)}
      </script>

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </Helmet>
  );
};

export default SEO;

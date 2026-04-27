import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * SEO Component implementation following modern best practices:
 * - Dynamic Title & Description (Localized)
 * - hreflang Tags for Multi-language indexing
 * - Open Graph Tags for Social Media
 * - JSON-LD Schema Markup for Rich Snippets
 */
const SEO = ({ 
  title, 
  description, 
  image = '/images/og-default.png', 
  url = window.location.href,
  type = 'website',
  schemaData = null 
}) => {
  const { i18n } = useTranslation();
  const siteName = 'Candy Shop';
  const fullTitle = `${title} | ${siteName}`;

  // Auto-calculate priceValidUntil for Schema (Dec 31 of current year)
  const currentYear = new Date().getFullYear();
  const validUntil = `${currentYear}-12-31`;

  // Construct hreflang URLs
  // Assumes URL structure is domain.com/:lang/...
  const baseUrl = window.location.origin;
  const pathWithoutLang = window.location.pathname.substring(3) || '/';
  
  const hlangVi = `${baseUrl}/vi${pathWithoutLang}`;
  const hlangEn = `${baseUrl}/en${pathWithoutLang}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={i18n.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* hreflang tags for Google Multi-language indexing */}
      <link rel="alternate" hrefLang="vi" href={hlangVi} />
      <link rel="alternate" hrefLang="en" href={hlangEn} />
      <link rel="alternate" hrefLang="x-default" href={hlangVi} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Structured Data (JSON-LD) */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify({
            ...schemaData,
            ...(schemaData['@type'] === 'Product' && schemaData.offers ? {
              offers: {
                ...schemaData.offers,
                priceValidUntil: validUntil
              }
            } : {})
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

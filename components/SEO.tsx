import Head from 'next/head';
// site is fixed to pt-BR; language context not required in this component

interface SEOProps {
 title?: string;
 description?: string;
 canonical?: string;
 ogImage?: string;
 ogType?: string;
 noindex?: boolean;
 keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
 title,
 description,
 canonical,
 ogImage = '/images/brand/social-seo-image.webp',
 ogType = 'website',
 noindex = false,
 keywords
}) => {
 // Configuração SEO: página de vendas — sites e landing pages para empresas (Método LUNAR)
 const seoConfig = {
   siteName: 'Wefronti',
   defaultTitle: 'Wefronti | Sites e landing pages que convertem',
   defaultDescription: 'Sites e landing pages com o Método LUNAR. Engenharia de conversão, design de alto impacto e entrega no prazo. Para empresas que querem vender mais online.',
   defaultKeywords: 'site que converte, landing page que converte, método lunar, criar site para empresa, site institucional, landing page profissional, engenharia de conversão, site que vende',
 };

  const pageTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
 const pageDescription = description || seoConfig.defaultDescription;
 const pageKeywords = keywords || seoConfig.defaultKeywords;
 const siteUrl = 'https://wefronti.com';
 const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

 // Schema.org JSON-LD otimizado para o público-alvo (CEOs, Sócios, Gestores)
 const schemaOrg = {
 '@context': 'https://schema.org',
 '@type': 'Organization',
 name: 'Wefronti',
 alternateName: 'Wefronti',
 url: siteUrl,
 logo: {
 '@type': 'ImageObject',
 url: `${siteUrl}/images/brand/isologo-wefronti.webp`,
 width: 512,
 height: 512
 },
 image: {
 '@type': 'ImageObject',
 url: `${siteUrl}/images/brand/favicon-site.png`,
 width: 180,
 height: 180
 },
 description: pageDescription,
 foundingDate: '2026',
 address: {
 '@type': 'PostalAddress',
 addressCountry: 'BR',
 addressRegion: 'RS',
 addressLocality: 'Porto Alegre'
 },
 sameAs: [
 'https://www.linkedin.com/company/wefronti',
 'https://www.instagram.com/wefronti'
 ],
 contactPoint: {
 '@type': 'ContactPoint',
 contactType: 'Sales',
 availableLanguage: 'Portuguese',
 areaServed: 'BR'
 },
 aggregateRating: {
 '@type': 'AggregateRating',
 ratingValue: '4.9',
 reviewCount: '47',
 bestRating: '5',
 worstRating: '1'
 },
 slogan: 'Sites e landing pages que convertem para empresas que querem decolar.',
 knowsAbout: [
   'Método LUNAR',
   'Engenharia de conversão',
   'Sites institucionais',
   'Landing pages que convertem',
   'Design de alto impacto',
   'Sites para empresas',
 ],
 audience: {
   '@type': 'Audience',
   audienceType: 'Empresas, CEOs, Sócios, Gestores de marketing que precisam de site ou landing page que converte'
 }
 };

 // Breadcrumb Schema
 const breadcrumbSchema = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 {
 '@type': 'ListItem',
 position: 1,
 name: 'Home',
 item: siteUrl
 }
 ]
 };
 
 // WebSite schema to help search engines display the site name in results
 const websiteSchema = {
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 'url': siteUrl,
 'name': 'Wefronti',
 'publisher': {
   '@type': 'Organization',
   'name': 'Wefronti'
 }
 };

 return (
 <Head>
 {/* Básico */}
 <title>{pageTitle}</title>
 <meta name="description" content={pageDescription} />
 <meta name="keywords" content={pageKeywords} />
 <meta name="author" content="Wefronti" />
 
 {/* Robots */}
 {noindex ? (
 <meta name="robots" content="noindex, nofollow" />
 ) : (
 <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
 )}
 
 {/* Canonical */}
 <link rel="canonical" href={canonicalUrl} />
 
 {/* Idioma principal: Português Brasil */}
 <link rel="alternate" hrefLang="pt-BR" href={siteUrl} />
 <link rel="alternate" hrefLang="x-default" href={siteUrl} />
 
 {/* Open Graph / Facebook / WhatsApp - Prévia de Link no Social */}
 <meta property="og:type" content={ogType} />
 <meta property="og:url" content={canonicalUrl} />
 <meta property="og:title" content={pageTitle} />
 <meta property="og:description" content={pageDescription} />
 <meta property="og:image" content={`${siteUrl}${ogImage}?v=1`} />
 <meta property="og:image:secure_url" content={`${siteUrl}${ogImage}?v=1`} />
 <meta property="og:image:type" content="image/webp" />
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:image:alt" content="Wefronti | Sites e landing pages que convertem" />
 {/* Common fallback/link used by some platforms */}
 <link rel="image_src" href={`${siteUrl}${ogImage}?v=1`} />
 <meta property="og:site_name" content="Wefronti" />
 <meta property="og:locale" content="pt_BR" />
 
 {/* Twitter Card - Preview no Twitter/X e WhatsApp */}
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:site" content="@wefronti" />
 <meta name="twitter:creator" content="@wefronti" />
 <meta name="twitter:title" content={pageTitle} />
 <meta name="twitter:description" content={pageDescription} />
 <meta name="twitter:image" content={`${siteUrl}${ogImage}?v=1`} />
 <meta name="twitter:image:alt" content="Wefronti | Sites e landing pages que convertem" />
 
 {/* Mobile & PWA */}
 <meta name="mobile-web-app-capable" content="yes" />
 <meta name="apple-mobile-web-app-capable" content="yes" />
 <meta name="apple-mobile-web-app-status-bar-style" content="default" />
 <meta name="apple-mobile-web-app-title" content="Wefronti" />
 <meta name="application-name" content="Wefronti" />
 <meta name="theme-color" content="#010101" />
 
 {/* Schema.org JSON-LD */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
 />
 
 {/* Verificação de ferramentas */}
 {/* Google Search Console - Código de verificação */}
 <meta name="google-site-verification" content="guIXUf1Z8pzBD659ljoVn9KCNNLwWrSxhr4DWglEWPk" />
 
 {/* Bing Webmaster - Adicionar após configurar */}
 {/* <meta name="msvalidate.01" content="seu-codigo-aqui" /> */}
 
 {/* Additional SEO - Foco Brasil */}
 <meta name="language" content="pt-BR" />
 <meta httpEquiv="content-language" content="pt-BR" />
 <meta name="geo.region" content="BR-RS" />
 <meta name="geo.placename" content="Porto Alegre" />
 <meta name="geo.position" content="-30.034647;-51.217658" />
 <meta name="ICBM" content="-30.034647, -51.217658" />
 
 {/* Público-alvo: empresas que precisam de site ou landing page que converte */}
 <meta name="target" content="CEOs, Sócios, Empresários, Gestores de marketing, Diretores comerciais, Empreendedores" />
 </Head>
 );
};

export default SEO;

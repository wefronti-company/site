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
 ogImage = '/images/brand/social-seo-image.png',
 ogType = 'website',
 noindex = false,
 keywords
}) => {
 // Configuração SEO focada em sites que convertem e geram vendas
 const seoConfig = {
   siteName: 'Wefronti',
   defaultTitle: 'Wefronti | Site que Converte e Gera Vendas',
   defaultDescription: 'Transformamos seu site em canal de vendas. Planejamento, design e tecnologia focados em conversão para sua empresa vender mais online.',
   defaultKeywords: 'criação de sites, site que converte, site profissional, site para empresas, site de vendas, desenvolvimento web, design de sites, otimização de conversão, SEO',
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
 url: `${siteUrl}/images/brand/isologo-black.png`,
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
 slogan: 'Tecnologia começa pelas pessoas.',
 knowsAbout: [
   'Sites institucionais',
   'Sites de conversão',
   'Desenvolvimento web',
   'Design de sites',
   'Landing pages',
   'E-commerce',
 ],
 audience: {
 '@type': 'Audience',
 audienceType: 'Business Decision Makers, CEOs, CTOs, Founders, Product Managers'
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
 
 {/* Open Graph / Facebook - Prévia de Link no Social */}
 <meta property="og:type" content={ogType} />
 <meta property="og:url" content={canonicalUrl} />
 <meta property="og:title" content={pageTitle} />
 <meta property="og:description" content={pageDescription} />
 <meta property="og:image" content={`${siteUrl}${ogImage}`} />
 <meta property="og:image:secure_url" content={`${siteUrl}${ogImage}`} />
 <meta property="og:image:type" content="image/png" />
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:image:alt" content="Wefronti | Site que Converte e Gera Vendas" />
 {/* Common fallback/link used by some platforms */}
 <link rel="image_src" href={`${siteUrl}${ogImage}`} />
 <meta name="twitter:image:src" content={`${siteUrl}${ogImage}`} />
 <meta property="og:site_name" content="Wefronti" />
 <meta property="og:locale" content="pt_BR" />
 
 {/* Twitter Card - Preview no Twitter/X e WhatsApp */}
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:site" content="@wefronti" />
 <meta name="twitter:creator" content="@wefronti" />
 <meta name="twitter:title" content={pageTitle} />
 <meta name="twitter:description" content={pageDescription} />
 <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
 <meta name="twitter:image:alt" content="Wefronti | Site que Converte e Gera Vendas" />
 
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
 <meta name="geo.region" content="BR-SP" />
 <meta name="geo.placename" content="São Paulo" />
 <meta name="geo.position" content="-23.550520;-46.633308" />
 <meta name="ICBM" content="-23.550520, -46.633308" />
 
 {/* Público-alvo específico */}
 <meta name="target" content="CEOs, Sócios, Gestores, Empresários, Empreendedores, Gerentes, Diretores de TI" />
 </Head>
 );
};

export default SEO;

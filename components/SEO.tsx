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
 ogImage = '/og-image.jpg',
 ogType = 'website',
 noindex = false,
 keywords
}) => {
 // Configuração SEO focada em Produtos Digitais com Propósito
 const seoConfig = {
 siteName: 'Wefronti',
 defaultTitle: 'Wefronti | Projetamos Produtos Digitais com Propósito',
 defaultDescription: 'SaaS, software e sistemas web desenvolvidos com tecnologias modernas e escaláveis. Do planejamento ao lançamento, entregamos produtos prontos para gerar resultados.',
 defaultKeywords: 'desenvolvimento de produto digital, saas sob medida, desenvolvimento de software empresarial, sistema web complexo, aplicativo mobile, ecommerce personalizado, inteligência artificial, transformação digital, produto digital escalável, desenvolvimento saas, software como serviço, plataforma web, app para negócios, desenvolvimento rio de janeiro',
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
 url: `${siteUrl}/images/isologo-black.webp`,
 width: 512,
 height: 512
 },
 image: {
 '@type': 'ImageObject',
 url: `${siteUrl}/images/favicon-site.webp`,
 width: 180,
 height: 180
 },
 description: pageDescription,
 foundingDate: '2019',
 address: {
 '@type': 'PostalAddress',
 addressCountry: 'BR',
 addressRegion: 'RJ',
 addressLocality: 'Rio de Janeiro'
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
 slogan: 'Projetamos produtos com propósito',
 knowsAbout: [
 'Desenvolvimento de SaaS',
 'Produtos Digitais',
 'Software sob Medida',
 'Sistemas Web Complexos',
 'Aplicativos Mobile',
 'E-commerce',
 'Inteligência Artificial',
 'Transformação Digital',
 'Plataformas Escaláveis'
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
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:image:alt" content="Wefronti" />
 <meta property="og:site_name" content="Wefronti" />
 <meta property="og:locale" content="pt_BR" />
 <meta property="fb:app_id" content="seu-app-id-facebook" /> {/* Adicionar após criar app Facebook */}
 
 {/* Mobile & PWA */}
 <meta name="mobile-web-app-capable" content="yes" />
 <meta name="apple-mobile-web-app-capable" content="yes" />
 <meta name="apple-mobile-web-app-status-bar-style" content="default" />
 <meta name="apple-mobile-web-app-title" content="Wefronti" />
 <meta name="theme-color" content="#000000" />
 
 {/* Schema.org JSON-LD */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
 />
 
 {/* Verificação de ferramentas */}
 {/* Google Search Console - Adicionar após configurar */}
 {/* <meta name="google-site-verification" content="seu-codigo-aqui" /> */}
 
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

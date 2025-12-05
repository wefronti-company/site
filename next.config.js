module.exports = {
  reactStrictMode: true,
  turbopack: {
    root: ".",
  },
  // Performance Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  // Security Headers (substitui Helmet)
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            // HSTS - Force HTTPS (previne Man-in-the-Middle)
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            // Previne Clickjacking (desvio de tráfego)
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            // Previne MIME sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            // XSS Protection
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            // Controla informações enviadas
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            // Bloqueia APIs perigosas
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()'
          },
          {
            // CSP - Content Security Policy (MÁXIMA PROTEÇÃO contra XSS e injeção)
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://prod-us-east-1.sql.db-internal-migration.neon.build https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com https://fonts.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
              "block-all-mixed-content"
            ].join('; ')
          },
          {
            // Previne DNS Rebinding Attack
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
          {
            // Previne Download de arquivos maliciosos
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            // Cross-Origin Protection (roubo de dados)
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          {
            // Certificate Transparency
            key: 'Expect-CT',
            value: 'max-age=86400, enforce'
          }
        ]
      }
    ]
  },
  // Prevenir exposição de informações sensíveis
  poweredByHeader: false,
  // Compressão
  compress: true,
};
import { TranslationKeys } from './pt-BR';

export const enUS: TranslationKeys = {
  // Language Selector
  languageSelector: {
    languages: {
      'pt-BR': 'Portuguese (BR)',
      'en-US': 'English (USA)'
    }
  },

  // AppBar
  appBar: {
    nav: {
      clients: 'Clients',
      services: 'Hire Us',
      projects: 'Projects',
      faq: 'FAQ'
    },
    cta: 'Start a project'
  },

  // Hero Section
  hero: {
    badge: 'Software House',
    title: 'We design products with purpose, ready to generate revenue',
    description: 'We develop your product with the best technology and artificial intelligence, from SaaS, software to complex web systems.',
    cta: 'Start a project',
    stats: {
      projects: 'Projects Delivered',
      clients: 'Clients Served',
      satisfaction: 'Client Satisfaction'
    },
    dashboard: {
      productTitle: 'Your product',
      productSubtitle: 'Demo example',
      updated: 'Updated',
      totalRevenue: 'Total Revenue',
      activeClients: 'Active Clients',
      monthlyRevenue: 'Monthly Revenue',
      roi: 'ROI',
      thisMonth: 'This month',
      last30Days: 'Last 30 days',
      months: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun'
      }
    },
    healthDashboard: {
      scheduleButton: 'Schedule Appointment',
      dataProtected: '100% protected data',
      placeholderName: 'Enter your full name',
      placeholderDate: 'Select date',
      placeholderSpecialty: 'Choose specialty'
    },
    vehicleTracking: {
      status: 'STATUS',
      inTransit: 'IN TRANSIT',
      speed: 'SPEED',
      tracking: 'Tracking',
      updatedNow: 'Updated now'
    },
    checkout: {
      checkoutButton: 'Checkout',
      securePayment: '100% secure payment'
    }
  },

  // Clients Section
  clients: {
    badge: 'Testimonials',
    title: 'What our clients say about us',
    subtitle: 'Satisfied clients around the world, connected by our digital solutions.',
    testimonials: [
      {
        name: 'Carlos Henrique',
        role: 'CEO',
        company: 'TechFlow Solutions',
        text: 'Wefronti completely transformed our vision into reality. The app developed exceeded all expectations in functionality and design.'
      },
      {
        name: 'Mariana Costa',
        role: 'Marketing Director',
        company: 'Innovate Corp',
        text: 'The e-commerce exceeded all our expectations. The user experience is impeccable and sales increased 150% in the first month.'
      },
      {
        name: 'Roberto Almeida',
        role: 'Founder',
        company: 'StartupXYZ',
        text: 'Extremely professional and dedicated team. They transformed our idea into a complete and scalable SaaS. Post-delivery support is excellent.'
      },
      {
        name: 'Julia Santos',
        role: 'Project Manager',
        company: 'Digital Solutions',
        text: 'The landing page turned out amazing! The modern and responsive design helped us convert many more leads. Development process was very smooth.'
      },
      {
        name: 'André Ferreira',
        role: 'CTO',
        company: 'FinTech Pro',
        text: 'Impeccable development of our financial system. They followed all security best practices and API integration was perfect.'
      }
    ]
  },

  // Services Section
  services: {
    badge: 'What we do',
    title: 'Services',
    subtitle: 'We turn your ideas into digital reality.',
    description: 'We develop custom solutions with the most modern technologies on the market, ensuring performance, scalability and the best experience for your users.',
    cta: 'Talk to us',
    teamTitle: 'Our team',
    teamDescription: 'Specialized and multidisciplinary team to turn your idea into reality.',
    teamRoles: [
      'Product Owner',
      'Scrum Master',
      'UI/UX Designer',
      'Back-end / Front-end Developer'
    ],
    ctaButton: 'Start a project',
    offerings: [
      {
        title: 'Mobile App, Software, SaaS.',
        description: 'Creation of systems, platforms, membership areas and web applications.',
        features: [
          'API Integrations',
          'Modern technologies',
          'Scalable system',
          'Post-delivery support',
          '100% customized'
        ],
        timeline: 'Timeline: 3 to 6 months'
      },
      {
        title: 'Website, Landing Page, E-commerce.',
        description: 'Web development for institutional websites and online stores.',
        features: [
          'Responsive for all screens',
          'Design that retains and converts',
          'Monthly maintenance',
          'Conversion strategies',
          '100% optimized'
        ],
        timeline: 'Timeline: 1 to 2 months'
      }
    ]
  },

  // Projects Section
  projects: {
    badge: 'Portfolio',
    title: 'Featured Projects',
    subtitle: 'Check out some of our recent work',
    viewProject: 'View project',
    categories: {
      all: 'All',
      saas: 'SaaS',
      tracking: 'Tracking',
      fintech: 'Fintech'
    },
    items: [
      {
        title: 'HealthHub Dashboard',
        description: 'Complete dashboard for clinic and hospital management with scheduling, electronic medical records and financial control.',
        category: 'SaaS',
        tags: ['Dashboard', 'Healthcare', 'Analytics']
      },
      {
        title: 'Fleet Tracker',
        description: 'Advanced real-time vehicle tracking system with geolocation, alerts and reports.',
        category: 'Tracking',
        tags: ['GPS', 'Real Time', 'Reports']
      },
      {
        title: 'Smart Checkout',
        description: 'Optimized checkout page with multiple payment methods, real-time validation and high conversion.',
        category: 'Fintech',
        tags: ['Checkout', 'Payments', 'Conversion']
      }
    ]
  },

  // FAQ Section
  faq: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Get answers about our services',
    cta: 'Talk to us',
    items: [
      {
        question: 'How long does it take to develop a project?',
        answer: 'The timeline varies according to complexity. Landing pages and institutional websites are ready in 1-2 months. SaaS systems and mobile apps take 3-6 months. After an initial meeting, we present a detailed schedule with all stages and deadlines.'
      },
      {
        question: 'What investment is needed to start?',
        answer: 'The investment varies according to project scope. Websites and landing pages start from $5,000. SaaS systems and apps have custom values based on required features. We offer transparent and detailed proposals before starting.'
      },
      {
        question: 'Do you offer support after delivery?',
        answer: 'Yes! We offer 30 days of free warranty for bug fixes. We also provide monthly maintenance plans that include updates, monitoring, backups, technical support and minor improvements. Support ensures your project continues to work perfectly.'
      },
      {
        question: 'Can I follow the project development?',
        answer: 'Absolutely! We work with agile methodology (Scrum) with 2-week sprints. You will have access to planning meetings, weekly reviews, staging environment for testing and direct communication via Slack/WhatsApp. Total transparency at all stages.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use the most modern and reliable technologies on the market. Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Python, PostgreSQL, MongoDB. Mobile: React Native, Flutter. Cloud: AWS, Vercel, Google Cloud. We choose the ideal stack for each project.'
      },
      {
        question: 'How do you ensure code quality and security?',
        answer: 'We apply software engineering best practices: code review on all code, automated tests, continuous integration, performance monitoring. In security, we implement robust authentication, data encryption, protection against common vulnerabilities and LGPD compliance. Quality is non-negotiable.'
      }
    ]
  },

  // Footer
  footer: {
    companyDescription: 'We develop digital solutions that transform businesses. From idea to launch, we create products that deliver real results.',
    servicesTitle: 'Services',
    services: {
      software: 'Software Development',
      mobile: 'Mobile Apps',
      ecommerce: 'E-commerce',
      consulting: 'Tech Consulting'
    },
    contactTitle: 'Contact',
    contact: {
      email: 'contact@wefronti.com',
      phone: '+1 (555) 123-4567',
      address: 'São Paulo, SP - Brazil'
    },
    socialTitle: 'Social Media',
    copyright: '© 2025 Wefronti. All rights reserved.'
  },

  // Quote Modal
  quoteModal: {
    title: 'Request Quote',
    subtitle: 'Fill out the form below and we will contact you soon',
    form: {
      name: 'Full name',
      whatsapp: 'WhatsApp',
      email: 'Email',
      company: 'Company',
      role: 'Position',
      roleOptions: {
        select: 'Select your position',
        ceo: 'CEO/Founder',
        cto: 'CTO',
        manager: 'Manager',
        developer: 'Developer',
        other: 'Other'
      },
      revenue: 'Monthly revenue',
      revenueOptions: {
        select: 'Select',
        '0-10k': '$0 - $10k',
        '10k-50k': '$10k - $50k',
        '50k-100k': '$50k - $100k',
        '100k-500k': '$100k - $500k',
        '500k+': '$500k+'
      },
      revenueHint: 'Confidential information, used only to customize our proposal',
      challenge: 'Challenge / What do you need?',
      timeline: 'Desired timeline',
      timelineOptions: {
        select: 'Select',
        immediate: 'Immediate (1-2 months)',
        short: 'Short term (2-4 months)',
        medium: 'Medium term (4-6 meses)',
        long: 'Long term (6+ months)'
      },
      submit: 'Send request',
      submitting: 'Sending...',
      successMessage: '✅ Request sent successfully! We will contact you soon.',
      errorMessage: 'Error sending request. Please try again.',
      privacy: {
        title: '🔒 Privacy and Data Protection',
        description: 'Your data is safe with us',
        points: [
          '✅ We do not share your data with third parties',
          '✅ Encrypted and protected data',
          '✅ Used only to analyze your request',
          '✅ You can request deletion at any time'
        ],
        consent: 'I agree to the collection and processing of my data as described above. I have read and accept that my data will be used exclusively for analyzing the quote request and will not be shared with third parties.',
        consentShort: 'I agree with the privacy policy and use of my data',
        required: 'You must agree to the privacy policy to continue'
      },
      validation: {
        name: 'Name must be at least 2 characters',
        email: 'Please enter a valid email',
        whatsapp: 'Please enter a valid number',
        company: 'Company name is required',
        role: 'Select your role',
        revenue: 'Select revenue',
        challenge: 'Describe your challenge (minimum 10 characters)',
        timeline: 'Select desired timeline'
      }
    }
  }
};

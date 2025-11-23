import React from 'react';
import ReactDOM from 'react-dom';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  sanitizeUserInput,
  isValidEmail,
  containsSuspiciousPatterns,
  enforceMaxLength,
  normalizeSpaces,
  validateInputTiming,
  isRealBrowser,
  addSecurityDelay,
  isValidOrigin,
} from '../../utils/security-frontend';

const QuoteModal: React.FC = () => {
  const { isOpen, closeModal } = useQuoteModal();
  const { t } = useLanguage();
  const [isDark, setIsDark] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formStartTime, setFormStartTime] = React.useState<number>(0);
  const [honeypot, setHoneypot] = React.useState(''); // Campo anti-bot
  const [privacyConsent, setPrivacyConsent] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = React.useState<'BR' | 'US'>('BR');
  const [formData, setFormData] = React.useState({
    name: '',
    whatsapp: '',
    email: '',
    company: '',
    role: '',
    revenue: '',
    challenge: '',
    timeline: ''
  });

  // Mount check for Portal
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Prevenir scroll do body quando modal está aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Registrar quando o formulário foi aberto (anti-bot)
      setFormStartTime(Date.now());
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpar erro do campo quando usuário começa a digitar
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Sanitização usando utilitários de segurança
    let sanitizedValue = value;
    
    switch (name) {
      case 'name':
      case 'company':
        sanitizedValue = sanitizeUserInput(value, 'text');
        sanitizedValue = enforceMaxLength(sanitizedValue, 100);
        break;
        
      case 'email':
        sanitizedValue = sanitizeUserInput(value, 'email');
        sanitizedValue = enforceMaxLength(sanitizedValue, 255);
        break;
        
      case 'whatsapp':
        // Aplicar máscara brasileira antes da sanitização
        const formatted = formatWhatsApp(value);
        sanitizedValue = sanitizeUserInput(formatted, 'phone');
        sanitizedValue = enforceMaxLength(sanitizedValue, 20);
        break;
        
      case 'challenge':
        sanitizedValue = sanitizeUserInput(value, 'textarea');
        sanitizedValue = enforceMaxLength(sanitizedValue, 2000);
        
        // Verificar padrões suspeitos
        if (containsSuspiciousPatterns(sanitizedValue)) {
          setErrorMessage('Texto contém conteúdo não permitido');
          return;
        }
        break;
        
      default:
        sanitizedValue = value;
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
  };

  // Função para formatar WhatsApp com base no país
  const formatWhatsApp = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (countryCode === 'BR') {
      // Brasil: (99) 9 9999-9999
      const limited = numbers.substring(0, 11);
      
      if (limited.length <= 2) {
        return limited;
      } else if (limited.length <= 3) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
      } else if (limited.length <= 7) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3)}`;
      } else {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3, 7)}-${limited.slice(7)}`;
      }
    } else {
      // USA: (999) 999-9999
      const limited = numbers.substring(0, 10);
      
      if (limited.length <= 3) {
        return limited;
      } else if (limited.length <= 6) {
        return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
      } else {
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    try {
      // Validações de campos individuais com mensagens customizadas
      const errors: Record<string, string> = {};
      
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = t.quoteModal.form.validation?.name || 'Nome deve ter pelo menos 2 caracteres';
      }
      
      if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = t.quoteModal.form.validation?.email || 'Por favor, insira um e-mail válido';
      }
      
      const minLength = countryCode === 'BR' ? 10 : 10;
      if (!formData.whatsapp || formData.whatsapp.replace(/\D/g, '').length < minLength) {
        errors.whatsapp = t.quoteModal.form.validation?.whatsapp || 'Por favor, insira um número válido';
      }
      
      if (!formData.company || formData.company.trim().length < 2) {
        errors.company = t.quoteModal.form.validation?.company || 'Nome da empresa é obrigatório';
      }
      
      if (!formData.role) {
        errors.role = t.quoteModal.form.validation?.role || 'Selecione seu cargo';
      }
      
      if (!formData.revenue) {
        errors.revenue = t.quoteModal.form.validation?.revenue || 'Selecione o faturamento';
      }
      
      if (!formData.challenge || formData.challenge.trim().length < 10) {
        errors.challenge = t.quoteModal.form.validation?.challenge || 'Descreva seu desafio (mínimo 10 caracteres)';
      }
      
      if (!formData.timeline) {
        errors.timeline = t.quoteModal.form.validation?.timeline || 'Selecione o prazo desejado';
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setIsSubmitting(false);
        // Rolar para o primeiro erro
        const firstErrorField = Object.keys(errors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Validação de consentimento LGPD
      if (!privacyConsent) {
        setErrorMessage(t.quoteModal.form.privacy.required);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      // 1. Validação de segurança antes de enviar
      
      // Verificar se é navegador real (anti-bot)
      if (!isRealBrowser()) {
        throw new Error('Navegador não suportado');
      }

      // Verificar origem
      if (!isValidOrigin()) {
        throw new Error('Origem não autorizada');
      }

      // Verificar honeypot (campo invisível que bots preenchem)
      if (honeypot !== '') {
        throw new Error('Validação falhou');
      }

      // Verificar tempo de preenchimento (muito rápido = bot)
      const formEndTime = Date.now();
      if (!validateInputTiming(formStartTime, formEndTime, 3000)) {
        throw new Error('Por favor, preencha o formulário com mais cuidado');
      }

      // Validação adicional de email
      if (!isValidEmail(formData.email)) {
        throw new Error('Email inválido');
      }

      // Normalizar espaços antes de enviar
      const normalizedData = {
        ...formData,
        name: normalizeSpaces(formData.name),
        company: normalizeSpaces(formData.company),
        challenge: normalizeSpaces(formData.challenge),
        privacy_consent: privacyConsent, // LGPD: Incluir consentimento
      };

      // 2. Adicionar delay de segurança (prevenir brute force)
      await addSecurityDelay(500);

      // 3. Enviar requisição
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar solicitação');
      }

      setSubmitStatus('success');
      
      // Limpar formulário
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        company: '',
        role: '',
        revenue: '',
        challenge: '',
        timeline: ''
      });
      setHoneypot('');
      setPrivacyConsent(false);

      // Fechar modal após 2 segundos
      setTimeout(() => {
        closeModal();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 transition-all"
        style={{
          backgroundColor: isDark ? 'rgba(1, 1, 1, 0.8)' : 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? '#010101' : '#f7f7f7',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b"
          style={{
            backgroundColor: isDark ? '#010101' : '#f7f7f7',
            borderBottomColor: isDark ? '#141414' : '#D1D5DB'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.quoteModal.title}
            </h2>
            <button
              onClick={closeModal}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all hover:scale-110"
              style={{
                backgroundColor: isDark ? '#1f1f1f' : '#e5e7eb'
              }}
              aria-label="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800 dark:text-gray-200">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
          
          {/* Honeypot - Campo invisível para capturar bots */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          {/* Nome completo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.name} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.quoteModal.form.name}
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-lg text-gray-900 dark:text-white transition-all duration-300 outline-none ${
                  fieldErrors.name 
                    ? 'border-2 border-red-500 animate-shake' 
                    : 'border border-gray-300 dark:border-gray-700'
                }`}
                style={{
                  backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                }}
              />
              {fieldErrors.name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-bounce-in">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>
            {fieldErrors.name && (
              <div 
                className="mt-2 flex items-start gap-2 p-3 rounded-lg animate-slide-down"
                style={{
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 1)',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {fieldErrors.name}
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp com seletor de país */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.whatsapp} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {/* Seletor de País */}
              <button
                type="button"
                onClick={() => setCountryCode(countryCode === 'BR' ? 'US' : 'BR')}
                className="flex items-center justify-center gap-2 px-4 rounded-lg border transition-all hover:scale-105 flex-shrink-0"
                style={{
                  backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                  borderColor: fieldErrors.whatsapp 
                    ? '#EF4444' 
                    : (isDark ? '#374151' : '#D1D5DB'),
                  borderWidth: fieldErrors.whatsapp ? '2px' : '1px',
                  height: '48px',
                  minWidth: '90px'
                }}
              >
                <span className="text-xl">{countryCode === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {countryCode === 'BR' ? '+55' : '+1'}
                </span>
              </button>
              
              {/* Input WhatsApp */}
              <div className="relative flex-1">
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder={countryCode === 'BR' ? '(99) 9 9999-9999' : '(999) 999-9999'}
                  required
                  className={`w-full px-4 py-3 rounded-lg text-gray-900 dark:text-white transition-all duration-300 outline-none ${
                    fieldErrors.whatsapp 
                      ? 'border-2 border-red-500 animate-shake' 
                      : 'border border-gray-300 dark:border-gray-700'
                  }`}
                  style={{
                    backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                    height: '48px'
                  }}
                />
                {fieldErrors.whatsapp && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-bounce-in">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {fieldErrors.whatsapp && (
              <div 
                className="mt-2 flex items-start gap-2 p-3 rounded-lg animate-slide-down"
                style={{
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 1)',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {fieldErrors.whatsapp}
                </p>
              </div>
            )}
          </div>

          {/* Email corporativo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.email} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.quoteModal.form.email}
                required
                className={`w-full px-4 py-3 rounded-lg text-gray-900 dark:text-white transition-all duration-300 outline-none ${
                  fieldErrors.email 
                    ? 'border-2 border-red-500 animate-shake' 
                    : 'border border-gray-300 dark:border-gray-700'
                }`}
                style={{
                  backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                }}
              />
              {fieldErrors.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-bounce-in">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>
            {fieldErrors.email && (
              <div 
                className="mt-2 flex items-start gap-2 p-3 rounded-lg animate-slide-down"
                style={{
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 1)',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {fieldErrors.email}
                </p>
              </div>
            )}
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.company} *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t.quoteModal.form.company}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.role} *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.roleOptions.select}</option>
              <option value="ceo">{t.quoteModal.form.roleOptions.ceo}</option>
              <option value="cto">{t.quoteModal.form.roleOptions.cto}</option>
              <option value="manager">{t.quoteModal.form.roleOptions.manager}</option>
              <option value="developer">{t.quoteModal.form.roleOptions.developer}</option>
              <option value="other">{t.quoteModal.form.roleOptions.other}</option>
            </select>
          </div>

          {/* Receita Mensal */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.revenue} *
            </label>
            <select
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.revenueOptions.select}</option>
              <option value="0-10k">{t.quoteModal.form.revenueOptions['0-10k']}</option>
              <option value="10k-50k">{t.quoteModal.form.revenueOptions['10k-50k']}</option>
              <option value="50k-100k">{t.quoteModal.form.revenueOptions['50k-100k']}</option>
              <option value="100k+">{t.quoteModal.form.revenueOptions['500k+']}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.quoteModal.form.revenueHint}
            </p>
          </div>

          {/* Desafio */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.challenge} *
            </label>
            <textarea
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              placeholder={t.quoteModal.form.challenge}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors resize-none"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.timelineOptions.select}</option>
              <option value="immediate">{t.quoteModal.form.timelineOptions.immediate}</option>
              <option value="short">{t.quoteModal.form.timelineOptions.short}</option>
              <option value="medium">{t.quoteModal.form.timelineOptions.medium}</option>
              <option value="long">{t.quoteModal.form.timelineOptions.long}</option>
            </select>
          </div>

          {/* Privacy Notice - LGPD */}
          <div className="p-5 rounded-lg border-2" style={{
            backgroundColor: isDark ? '#0a0a0a' : '#f8fafc',
            borderColor: isDark ? '#1e293b' : '#e2e8f0'
          }}>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.privacy.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {t.quoteModal.form.privacy.description}
            </p>
            <div className="space-y-1.5 mb-4">
              {t.quoteModal.form.privacy.points.map((point: string, index: number) => (
                <p key={index} className="text-xs text-gray-700 dark:text-gray-300">
                  {point}
                </p>
              ))}
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md" style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`
            }}>
              <input
                type="checkbox"
                id="privacyConsent"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: '#3B82F6'
                }}
              />
              <label 
                htmlFor="privacyConsent" 
                className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed"
              >
                {t.quoteModal.form.privacy.consentShort}
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg animate-slide-down"
              style={{
                backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 1)',
                border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500 flex-shrink-0 mt-0.5 animate-bounce-in">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                  ✓ Sucesso!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {t.quoteModal.form.successMessage}
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg animate-slide-down"
              style={{
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 1)',
                border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5 animate-bounce-in">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">
                  ✗ Erro ao enviar
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errorMessage || t.quoteModal.form.errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 text-base font-semibold text-white rounded-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#3B82F6'
            }}
          >
            {isSubmitting ? t.quoteModal.form.submitting : t.quoteModal.form.submit}
          </button>

        </form>
      </div>
    </div>
  );

  // Renderizar via Portal para escapar contexto das sections
  return ReactDOM.createPortal(modalContent, document.body);
};

export default QuoteModal;

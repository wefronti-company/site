import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { colors } from '../../styles/colors';
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

const CTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formStartTime, setFormStartTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    investment: '',
    projectType: '',
    urgency: '',
    details: ''
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
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
      
      case 'phone':
        const formatted = formatPhone(value);
        sanitizedValue = sanitizeUserInput(formatted, 'phone');
        sanitizedValue = enforceMaxLength(sanitizedValue, 20);
        break;
      
      case 'details':
        sanitizedValue = sanitizeUserInput(value, 'textarea');
        sanitizedValue = enforceMaxLength(sanitizedValue, 2000);
        
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

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
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
  };

  const handleSelectChange = (name: string, value: string) => {
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setFormData({
      ...formData,
      [name]: value
    });
    setOpenDropdown(null);
  };

  const getSelectLabel = (value: string, options: Array<{value: string, label: string}>) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : 'Selecione';
  };

  const CustomSelect: React.FC<{
    id: string;
    name: string;
    value: string;
    label: string;
    placeholder: string;
    options: Array<{value: string, label: string}>;
    error?: string;
  }> = ({ id, name, value, label, placeholder, options, error }) => {
    const isOpen = openDropdown === name;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div ref={dropdownRef} className="relative">
        <label htmlFor={id} className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
          {label}
        </label>
        <div
          onClick={() => setOpenDropdown(isOpen ? null : name)}
          className="w-full px-4 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between"
          style={{
            backgroundColor: '#ffffff',
            border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            color: value ? '#000000' : '#9ca3af',
            borderRadius: '4px'
          }}
        >
          <span>{getSelectLabel(value, options)}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        
        {isOpen && (
          <div
            className="absolute w-full mt-1 py-2 z-50 shadow-lg"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectChange(name, option.value)}
                className="px-4 py-3 cursor-pointer transition-colors text-sm"
                style={{
                  backgroundColor: value === option.value ? '#f3f4f6' : '#ffffff',
                  color: '#000000'
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{error}</p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const errors: Record<string, string> = {};
      
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres';
      }
      
      if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = 'Por favor, insira um e-mail válido';
      }
      
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Por favor, insira um número válido';
      }
      
      if (!formData.company || formData.company.trim().length < 2) {
        errors.company = 'Nome da empresa é obrigatório';
      }
      
      if (!formData.investment) {
        errors.investment = 'Selecione o valor para investimento';
      }
      
      if (!formData.projectType) {
        errors.projectType = 'Selecione o tipo de projeto';
      }
      
      if (!formData.urgency) {
        errors.urgency = 'Selecione o nível de urgência';
      }
      
      if (!formData.details || formData.details.trim().length < 10) {
        errors.details = 'Descreva seu projeto (mínimo 10 caracteres)';
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setIsSubmitting(false);
        const firstErrorField = Object.keys(errors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (!isRealBrowser()) {
        throw new Error('Navegador não suportado');
      }

      if (!isValidOrigin()) {
        throw new Error('Origem não autorizada');
      }

      if (honeypot !== '') {
        throw new Error('Validação falhou');
      }

      const formEndTime = Date.now();
      if (!validateInputTiming(formStartTime, formEndTime, 3000)) {
        throw new Error('Por favor, preencha o formulário com mais cuidado');
      }

      const normalizedData = {
        ...formData,
        name: normalizeSpaces(formData.name),
        company: normalizeSpaces(formData.company),
        details: normalizeSpaces(formData.details),
      };

      await addSecurityDelay(500);

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
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        investment: '',
        projectType: '',
        urgency: '',
        details: ''
      });
      setHoneypot('');

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contato"
      className="w-full py-20 md:py-32 relative overflow-hidden border-t"
      style={{ background: colors.background.dark, borderTopColor: colors.neutral.borderDark }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <style dangerouslySetInnerHTML={{
          __html: `
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active,
            textarea:-webkit-autofill,
            textarea:-webkit-autofill:hover,
            textarea:-webkit-autofill:focus,
            textarea:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
              -webkit-text-fill-color: #000000 !important;
              box-shadow: 0 0 0 30px #ffffff inset !important;
              transition: background-color 5000s ease-in-out 0s;
            }

            input:focus,
            textarea:focus {
              border-color: ${colors.neutral.borderDark} !important;
              outline: none;
            }
          `
        }} />
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex-1 text-left">
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4">
                <span style={{ color: colors.text.light }}>Vamos falar sobre<br /></span>
                <span style={{ color: colors.text.dark }}>o que você quer construir.</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: colors.text.light, opacity: 0.7 }}>
                Projetos relevantes começam com boas conversas e expectativas bem definidas.
              </p>
            </div>

            {/* Circular badge with rotating icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="flex-shrink-0"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center"
              >
                <img 
                  src="/images/icons/icon-hero-circle.png" 
                  alt="Badge" 
                  className="w-full h-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="p-6 md:p-10 rounded-[4px]"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            style={{
              backgroundColor: colors.background.light,
              border: `10px solid ${colors.neutral.borderLight}`
            }}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Honeypot */}
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

              {/* Grid: Nome e E-mail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm transition-colors"
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${fieldErrors.name ? '#ef4444' : '#e5e7eb'}`,
                      color: '#000000',
                      borderRadius: '4px'
                    }}
                    placeholder="Seu nome"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm transition-colors"
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${fieldErrors.email ? '#ef4444' : '#e5e7eb'}`,
                      color: '#000000',
                      borderRadius: '4px'
                    }}
                    placeholder="seu@email.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Grid: Celular e Empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
                    Celular *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm transition-colors"
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${fieldErrors.phone ? '#ef4444' : '#e5e7eb'}`,
                      color: '#000000',
                      borderRadius: '4px'
                    }}
                    placeholder="(00) 0 0000-0000"
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
                    Empresa *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm transition-colors"
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${fieldErrors.company ? '#ef4444' : '#e5e7eb'}`,
                      color: '#000000',
                      borderRadius: '4px'
                    }}
                    placeholder="Nome da empresa"
                  />
                  {fieldErrors.company && (
                    <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.company}</p>
                  )}
                </div>
              </div>

              {/* Grid: Investimento, Tipo de Projeto e Urgência - 3 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CustomSelect
                  id="investment"
                  name="investment"
                  value={formData.investment}
                  label="Valor para investimento *"
                  placeholder="Selecione"
                  options={[
                    { value: '5k-15k', label: 'R$ 5.000 - R$ 15.000' },
                    { value: '15k-30k', label: 'R$ 15.000 - R$ 30.000' },
                    { value: '30k-50k', label: 'R$ 30.000 - R$ 50.000' },
                    { value: '50k-100k', label: 'R$ 50.000 - R$ 100.000' },
                    { value: '100k+', label: 'Acima de R$ 100.000' }
                  ]}
                  error={fieldErrors.investment}
                />

                <CustomSelect
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  label="Tipo de projeto *"
                  placeholder="Selecione"
                  options={[
                    { value: 'site', label: 'Site' },
                    { value: 'ecommerce', label: 'E-commerce' },
                    { value: 'sistema', label: 'Sistema' },
                    { value: 'Saas', label: 'Saas' },
                    { value: 'dashboard', label: 'Dashboard' },
                    { value: 'api', label: 'API / Integração' },
                    { value: 'outro', label: 'Outro' }
                  ]}
                  error={fieldErrors.projectType}
                />

                <CustomSelect
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  label="Nível de urgência *"
                  placeholder="Selecione"
                  options={[
                    { value: 'baixa', label: 'Baixa' },
                    { value: 'media', label: 'Média' },
                    { value: 'alta', label: 'Alta' },
                    { value: 'urgente', label: 'Urgente' }
                  ]}
                  error={fieldErrors.urgency}
                />
              </div>

              {/* Detalhes do Projeto */}
              <div>
                <label htmlFor="details" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>
                  Conte mais sobre seu projeto *
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 text-sm transition-colors resize-none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: `1px solid ${fieldErrors.details ? '#ef4444' : '#e5e7eb'}`,
                    color: '#000000',
                    borderRadius: '4px'
                  }}
                  placeholder="Descreva seu projeto, desafios, objetivos e qualquer outra informação relevante..."
                />
                {fieldErrors.details && (
                  <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.details}</p>
                )}
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}>
                  <p className="text-sm" style={{ color: '#22c55e' }}>
                    ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {errorMessage || 'Erro ao enviar mensagem. Tente novamente.'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 font-medium text-base transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: colors.neutral.gray,
                  color: colors.text.light,
                  borderRadius: '4px'
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
              </button>

              {/* Privacy Notice */}
              <p className="text-xs text-center flex items-center justify-center gap-2" style={{ color: '#6b7280' }}>
                <Lock className="w-3 h-3" /> Seus dados estão seguros. Não compartilhamos suas informações com terceiros.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

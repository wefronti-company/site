import React from 'react';
import Head from 'next/head';
import ButtonCta from '../components/ui/ButtonCta';
import dynamic from 'next/dynamic';
import { colors } from '../styles/colors';
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
} from '../utils/security-frontend';

const AppBar = dynamic(() => import('../components/layout/AppBar'), { ssr: false });
const Footer = dynamic(() => import('../sections/Footer'), { ssr: false });

const FormPage: React.FC = () => {
 const [isSubmitting, setIsSubmitting] = React.useState(false);
 const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
 const [errorMessage, setErrorMessage] = React.useState('');
 const [formStartTime, setFormStartTime] = React.useState<number>(0);
 const [honeypot, setHoneypot] = React.useState('');
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
 
 case 'whatsapp':
 const formatted = formatWhatsApp(value);
 sanitizedValue = sanitizeUserInput(formatted, 'phone');
 sanitizedValue = enforceMaxLength(sanitizedValue, 20);
 break;
 
 case 'challenge':
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

 const formatWhatsApp = (value: string): string => {
 const numbers = value.replace(/\D/g, '');
 
 if (countryCode === 'BR') {
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
 const errors: Record<string, string> = {};
 
 if (!formData.name || formData.name.trim().length < 2) {
 errors.name = 'Nome deve ter pelo menos 2 caracteres';
 }
 
 if (!formData.email || !isValidEmail(formData.email)) {
 errors.email = 'Por favor, insira um e-mail válido';
 }
 
 const minLength = countryCode === 'BR' ? 10 : 10;
 if (!formData.whatsapp || formData.whatsapp.replace(/\D/g, '').length < minLength) {
 errors.whatsapp = 'Por favor, insira um número válido';
 }
 
 if (!formData.company || formData.company.trim().length < 2) {
 errors.company = 'Nome da empresa é obrigatório';
 }
 
 if (!formData.role) {
 errors.role = 'Selecione seu cargo';
 }
 
 if (!formData.revenue) {
 errors.revenue = 'Selecione o faturamento';
 }
 
 if (!formData.challenge || formData.challenge.trim().length < 10) {
 errors.challenge = 'Descreva seu desafio (mínimo 10 caracteres)';
 }
 
 if (!formData.timeline) {
 errors.timeline = 'Selecione o prazo desejado';
 }
 
 if (Object.keys(errors).length > 0) {
 setFieldErrors(errors);
 setIsSubmitting(false);
 const firstErrorField = Object.keys(errors)[0];
 document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 return;
 }

 if (!privacyConsent) {
 setErrorMessage('Você precisa concordar com os termos de privacidade');
 setSubmitStatus('error');
 setIsSubmitting(false);
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

 if (!isValidEmail(formData.email)) {
 throw new Error('Email inválido');
 }

 const normalizedData = {
 ...formData,
 name: normalizeSpaces(formData.name),
 company: normalizeSpaces(formData.company),
 challenge: normalizeSpaces(formData.challenge),
 privacy_consent: privacyConsent,
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

 setTimeout(() => {
 window.location.href = '/';
 }, 3000);

 } catch (error) {
 setSubmitStatus('error');
 setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar sua solicitação');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <>
 <Head>
 <title>Solicite um Orçamento | Wefronti</title>
 <meta name="description" content="Solicite um orçamento personalizado para seu projeto" />
 <meta name="robots" content="noindex, nofollow" />
 </Head>

 <AppBar />

 <div className="min-h-screen" style={{ backgroundColor: colors.blackColor }}>
 
 <main className="pb-16 px-4" style={{ paddingTop: '200px' }}>
 <div className="max-w-4xl mx-auto">
 {/* Header */}
 <div className="mb-12">
 <h1 
 className="text-4xl md:text-4xl lg:text-5xl font-medium bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4"
 >
 Solicite um Orçamento
 </h1>
 <p 
 className="text-lg text-gray-300"
 >
 Preencha o formulário abaixo e nossa equipe entrará em contato
 </p>
 </div>

 {/* Form Card */}
 <div  className="shadow-xl p-6 md:p-10"
 style={{
 backgroundColor: colors.blackColor,
 border: `1px solid ${colors.borderDark}`,
 borderRadius: '10px',
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
 
 {/* Grid: Nome e WhatsApp */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Nome completo */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Nome completo <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 placeholder="Nome completo"
 required
 minLength={2}
 maxLength={100}
 autoComplete="name"
 className={`w-full px-4 py-3 rounded-[10px] transition-all duration-300 outline-none ${
 fieldErrors.name 
 ? 'border-2 border-red-500' 
 : ''
 }`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.name ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 />
 {fieldErrors.name && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 </div>
 )}
 </div>
 {fieldErrors.name && (
 <div 
 className="mt-2 flex items-start gap-2 p-3 rounded-[10px]"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
 <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <p className="text-sm text-red-600 font-medium">
 {fieldErrors.name}
 </p>
 </div>
 )}
 </div>

 {/* WhatsApp com seletor de país */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 WhatsApp <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <input
 type="tel"
 name="whatsapp"
 value={formData.whatsapp}
 onChange={handleChange}
 placeholder="(99) 9 9999-9999"
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all duration-300 outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.whatsapp ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 />
 {fieldErrors.whatsapp && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 </div>
 )}
 </div>
 {fieldErrors.whatsapp && (
 <div 
 className="mt-2 flex items-start gap-2 p-3 rounded-[10px]"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
 <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <p className="text-sm text-red-600 font-medium">
 {fieldErrors.whatsapp}
 </p>
 </div>
 )}
 </div>
 
 </div>

 {/* Grid: Email e Empresa */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Email */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 E-mail <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 placeholder="seu@email.com"
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all duration-300 outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.email ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 />
 {fieldErrors.email && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 </div>
 )}
 </div>
 {fieldErrors.email && (
 <div 
 className="mt-2 flex items-start gap-2 p-3 rounded-[10px]"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
 <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <p className="text-sm text-red-600 font-medium">
 {fieldErrors.email}
 </p>
 </div>
 )}
 </div>

 {/* Empresa */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Empresa <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 name="company"
 value={formData.company}
 onChange={handleChange}
 placeholder="Nome da empresa"
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.company ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 />
 {fieldErrors.company && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.company}
 </p>
 )}
 </div>
 
 </div>

 {/* Grid: Cargo e Receita */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Cargo */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Cargo <span className="text-red-500">*</span>
 </label>
 <select
 name="role"
 value={formData.role}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.role ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 >
 <option value="">Selecione seu cargo</option>
 <option value="ceo">CEO / Founder</option>
 <option value="cto">CTO / Tech Lead</option>
 <option value="manager">Gerente</option>
 <option value="developer">Desenvolvedor</option>
 <option value="other">Outro</option>
 </select>
 {fieldErrors.role && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.role}
 </p>
 )}
 </div>

 {/* Receita Mensal */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Faturamento Mensal <span className="text-red-500">*</span>
 </label>
 <select
 name="revenue"
 value={formData.revenue}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.revenue ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 >
 <option value="">Selecione o faturamento</option>
 <option value="0-10k">Até R$ 10 mil/mês</option>
 <option value="10k-50k">R$ 10 mil - R$ 50 mil/mês</option>
				<option value="50k-100k">R$ 50 mil - R$ 100 mil/mês</option>
				<option value="100k-500k">R$ 100 mil - R$ 500 mil/mês</option>
				<option value="500k+">Acima de R$ 500 mil/mês</option>
 </select>
 <p className="text-xs mt-1" style={{ color: colors.whiteColor, opacity: 0.6 }}>
 Essa informação nos ajuda a personalizar melhor nossa proposta
 </p>
 {fieldErrors.revenue && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.revenue}
 </p>
 )}
 </div>
 
 </div>

 {/* Desafio */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Descreva seu desafio <span className="text-red-500">*</span>
 </label>
 <textarea
 name="challenge"
 value={formData.challenge}
 onChange={handleChange}
 placeholder="Conte-nos sobre seu projeto ou desafio..."
 required
 rows={4}
 className={`w-full px-4 py-3 rounded-[10px] transition-all resize-none outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.challenge ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 />
 {fieldErrors.challenge && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.challenge}
 </p>
 )}
 </div>

 {/* Timeline */}
 <div>
 <label className="block text-sm font-medium mb-2" style={{ color: colors.whiteColor }}>
 Prazo desejado <span className="text-red-500">*</span>
 </label>
 <select
 name="timeline"
 value={formData.timeline}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-[10px] transition-all outline-none`}
 style={{
 backgroundColor: colors.colorGray,
 border: fieldErrors.timeline ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
 color: colors.whiteColor
 }}
 >
 <option value="">Selecione o prazo</option>
 <option value="immediate">Imediato (1-2 semanas)</option>
 <option value="short">Curto prazo (1 mês)</option>
 <option value="medium">Médio prazo (2-3 meses)</option>
 <option value="long">Longo prazo (3+ meses)</option>
 </select>
 {fieldErrors.timeline && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.timeline}
 </p>
 )}
 </div>

 {/* Privacy Consent - LGPD */}
 <div className="flex items-start gap-3">
 <input
 type="checkbox"
 id="privacyConsent"
 checked={privacyConsent}
 onChange={(e) => setPrivacyConsent(e.target.checked)}
 className="mt-1 w-4 h-4 rounded cursor-pointer"
 style={{
 accentColor: colors.colorGray
 }}
 />
 <label 
 htmlFor="privacyConsent" 
 className="text-xs cursor-pointer leading-relaxed"
 style={{ color: colors.whiteColor, opacity: 0.8 }}
 >
 Eu concordo com o tratamento dos meus dados conforme a <a href="/politica-privacidade" target="_blank" className="underline" style={{ color: colors.gradientOne }}>Política de Privacidade</a> e LGPD
 </label>
 </div>

 {/* Status Messages */}
 {submitStatus === 'success' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-[10px]"
 style={{
 backgroundColor: 'rgba(220, 252, 231, 1)',
 border: `1px solid 'rgba(34, 197, 94, 0.3)'`,
 }}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500 flex-shrink-0 mt-0.5">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <div>
 <p className="text-sm text-green-700 font-semibold">
 ✓ Sucesso!
 </p>
 <p className="text-xs text-green-600 mt-1">
 Sua solicitação foi enviada com sucesso! Em breve entraremos em contato.
 </p>
 </div>
 </div>
 )}

 {submitStatus === 'error' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-[10px]"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <div>
 <p className="text-sm text-red-700 font-semibold">
 ✗ Erro ao enviar
 </p>
 <p className="text-xs text-red-600 mt-1">
 {errorMessage || 'Erro ao enviar formulário. Tente novamente.'}
 </p>
 </div>
 </div>
 )}

 {/* Submit Button */}
 <div className="flex justify-start">
 <ButtonCta
 variant="gradient"
 onClick={() => {}}
 disabled={isSubmitting}
 type="submit"
 >
 {isSubmitting ? 'Enviando...' : 'Enviar'}
 </ButtonCta>
 </div>

 </form>
 </div>
 </div>
 </main>

 <Footer />
 </div>
 </>
 );
};

export default FormPage;

import React from 'react';
import Head from 'next/head';
import AppBar from '../components/layout/AppBar';
import ButtonCta from '../components/ui/ButtonCta';
import dynamic from 'next/dynamic';
import { useLanguage } from '../contexts/LanguageContext';
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

const Footer = dynamic(() => import('../sections/Footer/Footer'), { ssr: false });

const FormPage: React.FC = () => {
 const { t } = useLanguage();
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
 const firstErrorField = Object.keys(errors)[0];
 document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 return;
 }

 if (!privacyConsent) {
 setErrorMessage(t.quoteModal.form.privacy.required);
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
 <title>{t.quoteModal.title} | Wefronti</title>
 <meta name="description" content="Solicite um orçamento personalizado para seu projeto" />
 <meta name="robots" content="noindex, nofollow" />
 </Head>

 <div className="min-h-screen bg-gray-50">
 <AppBar />
 
 <main className="pt-24 pb-16 px-4">
 <div className="max-w-3xl mx-auto">
 {/* Header */}
 <div className="mb-12">
 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
 {t.quoteModal.title}
 </h1>
 <p className="text-base text-gray-600">
 Preencha o formulário abaixo e nossa equipe entrará em contato
 </p>
 </div>

 {/* Form Card */}
 <div 
 className="rounded-2xl shadow-xl p-6 md:p-10"
 style={{
 backgroundColor: colors.whiteColor,
 border: `1px solid ${colors.borderLight}`
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
 
 {/* Nome completo */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
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
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none ${
 fieldErrors.name 
 ? 'border-2 border-red-500' 
 : ''
 }`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.name ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
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
 className="mt-2 flex items-start gap-2 p-3 rounded-lg"
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
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.whatsapp} <span className="text-red-500">*</span>
 </label>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setCountryCode(countryCode === 'BR' ? 'US' : 'BR')}
 className="flex items-center justify-center gap-2 px-4 rounded-lg border transition-all hover:scale-105 flex-shrink-0"
 style={{
 backgroundColor: colors.whiteColor,
 borderColor: fieldErrors.whatsapp 
 ? '#EF4444' 
 : (colors.borderLight),
 borderWidth: fieldErrors.whatsapp ? '2px' : '1px',
 height: '48px',
 minWidth: '90px'
 }}
 >
 <span className="text-xl">{countryCode === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
 <span className="text-sm font-semibold text-gray-700">
 {countryCode === 'BR' ? '+55' : '+1'}
 </span>
 </button>
 
 <div className="relative flex-1">
 <input
 type="tel"
 name="whatsapp"
 value={formData.whatsapp}
 onChange={handleChange}
 placeholder={countryCode === 'BR' ? '(99) 9 9999-9999' : '(999) 999-9999'}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.whatsapp ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
 height: '48px'
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
 </div>
 {fieldErrors.whatsapp && (
 <div 
 className="mt-2 flex items-start gap-2 p-3 rounded-lg"
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

 {/* Email */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
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
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.email ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
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
 className="mt-2 flex items-start gap-2 p-3 rounded-lg"
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
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.company} <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 name="company"
 value={formData.company}
 onChange={handleChange}
 placeholder={t.quoteModal.form.company}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.company ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
 }}
 />
 {fieldErrors.company && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.company}
 </p>
 )}
 </div>

 {/* Cargo */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.role} <span className="text-red-500">*</span>
 </label>
 <select
 name="role"
 value={formData.role}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.role ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
 }}
 >
 <option value="">{t.quoteModal.form.roleOptions.select}</option>
 <option value="ceo">{t.quoteModal.form.roleOptions.ceo}</option>
 <option value="cto">{t.quoteModal.form.roleOptions.cto}</option>
 <option value="manager">{t.quoteModal.form.roleOptions.manager}</option>
 <option value="developer">{t.quoteModal.form.roleOptions.developer}</option>
 <option value="other">{t.quoteModal.form.roleOptions.other}</option>
 </select>
 {fieldErrors.role && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.role}
 </p>
 )}
 </div>

 {/* Receita Mensal */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.revenue} <span className="text-red-500">*</span>
 </label>
 <select
 name="revenue"
 value={formData.revenue}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.revenue ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
 }}
 >
 <option value="">{t.quoteModal.form.revenueOptions.select}</option>
 <option value="0-10k">{t.quoteModal.form.revenueOptions['0-10k']}</option>
 <option value="10k-50k">{t.quoteModal.form.revenueOptions['10k-50k']}</option>
 <option value="50k-100k">{t.quoteModal.form.revenueOptions['50k-100k']}</option>
 <option value="100k+">{t.quoteModal.form.revenueOptions['500k+']}</option>
 </select>
 <p className="text-xs text-gray-500 mt-1">
 {t.quoteModal.form.revenueHint}
 </p>
 {fieldErrors.revenue && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.revenue}
 </p>
 )}
 </div>

 {/* Desafio */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.challenge} <span className="text-red-500">*</span>
 </label>
 <textarea
 name="challenge"
 value={formData.challenge}
 onChange={handleChange}
 placeholder={t.quoteModal.form.challenge}
 required
 rows={4}
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all resize-none outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.challenge ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
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
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {t.quoteModal.form.timeline} <span className="text-red-500">*</span>
 </label>
 <select
 name="timeline"
 value={formData.timeline}
 onChange={handleChange}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all outline-none`}
 style={{
 backgroundColor: colors.whiteColor,
 border: fieldErrors.timeline ? '2px solid #EF4444' : `1px solid ${colors.borderLight}`,
 }}
 >
 <option value="">{t.quoteModal.form.timelineOptions.select}</option>
 <option value="immediate">{t.quoteModal.form.timelineOptions.immediate}</option>
 <option value="short">{t.quoteModal.form.timelineOptions.short}</option>
 <option value="medium">{t.quoteModal.form.timelineOptions.medium}</option>
 <option value="long">{t.quoteModal.form.timelineOptions.long}</option>
 </select>
 {fieldErrors.timeline && (
 <p className="mt-2 text-sm text-red-600">
 {fieldErrors.timeline}
 </p>
 )}
 </div>

 {/* Privacy Notice - LGPD */}
 <div className="p-5 rounded-lg border-2" style={{
 backgroundColor: '#f8fafc',
 borderColor: colors.borderLight
 }}>
 <h4 className="text-sm font-bold text-gray-900 mb-2">
 {t.quoteModal.form.privacy.title}
 </h4>
 <p className="text-xs text-gray-600 mb-3">
 {t.quoteModal.form.privacy.description}
 </p>
 <div className="space-y-1.5 mb-4">
 {t.quoteModal.form.privacy.points.map((point: string, index: number) => (
 <p key={index} className="text-xs text-gray-700">
 {point}
 </p>
 ))}
 </div>
 <div className="flex items-start gap-3 p-3 rounded-md" style={{
 backgroundColor: '#ffffff',
 border: `1px solid '#cbd5e1'`
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
 className="text-xs text-gray-700 cursor-pointer leading-relaxed"
 >
 {t.quoteModal.form.privacy.consentShort}
 </label>
 </div>
 </div>

 {/* Status Messages */}
 {submitStatus === 'success' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-lg"
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
 {t.quoteModal.form.successMessage}
 </p>
 </div>
 </div>
 )}

 {submitStatus === 'error' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-lg"
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
 {errorMessage || t.quoteModal.form.errorMessage}
 </p>
 </div>
 </div>
 )}

 {/* Submit Button */}
 <div className="flex justify-start">
 <button
 type="submit"
 disabled={isSubmitting}
 className="px-8 py-3 text-base font-medium text-white rounded-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
 style={{
 backgroundColor: colors.blueColor
 }}
 >
 {isSubmitting ? t.quoteModal.form.submitting : t.quoteModal.form.submit}
 </button>
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

import React from 'react';
import { createPortal } from 'react-dom';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
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

 // Check theme
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
 // Rolar para o primeiro erro
 const firstErrorField = Object.keys(errors)[0];
 document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 return;
 }

 // Validação de consentimento LGPD
 if (!privacyConsent) {
 setErrorMessage('Você precisa concordar com a política de privacidade para continuar');
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

 // Criar container dedicado para o modal se não existir
 React.useEffect(() => {
 if (typeof window !== 'undefined') {
 let container = document.getElementById('quote-modal-root');
 if (!container) {
 container = document.createElement('div');
 container.id = 'quote-modal-root';
 container.style.cssText = `
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: 999999;
 pointer-events: none;
 `;
 document.body.appendChild(container);
 }
 }
 }, []);

 if (!isOpen) return null;
 if (typeof window === 'undefined') return null;

 const modalRoot = document.getElementById('quote-modal-root');
 if (!modalRoot) return null;

 const modalContent = (
 <div 
 style={{ 
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 width: '100vw',
 height: '100vh',
 zIndex: 999999,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '1rem',
 pointerEvents: 'auto'
 }}
 onClick={closeModal}
 >
 {/* Backdrop com blur */}
 <div 
 style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 width: '100%',
 height: '100%',
 backgroundColor: 'rgba(0, 0, 0, 0.6)',
 backdropFilter: 'blur(8px)',
 WebkitBackdropFilter: 'blur(8px)',
 transition: 'all 0.3s',
 zIndex: 1
 }}
 />

 {/* Modal Container */}
 <div 
 onClick={(e) => e.stopPropagation()}
 style={{
 position: 'relative',
 width: '100%',
 maxWidth: '48rem',
 maxHeight: '90vh',
 overflowY: 'auto',
 zIndex: 10,
 backgroundColor: '#f7f7f7',
 borderRadius: '12px',
 border: `1px solid ${'#D1D5DB'}`
 }}
 >
 {/* Header */}
 <div className="sticky top-0 z-10 px-6 py-4 border-b"
 style={{
 backgroundColor: '#f7f7f7',
 borderBottomColor: '#D1D5DB'
 }}
 >
 <div className="flex items-center justify-between">
 <h2 className="text-2xl font-semibold text-gray-900">
 Solicitar Orçamento
 </h2>
 <button
 onClick={closeModal}
 className="w-8 h-8 flex items-center justify-center rounded-md transition-all hover:scale-110"
 style={{
 backgroundColor: '#e5e7eb'
 }}
 aria-label="Fechar"
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800">
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
 <label className="block text-sm font-medium text-gray-900 mb-2">
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
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none ${
 fieldErrors.name 
 ? 'border-2 border-red-500 animate-shake' 
 : 'border border-gray-300'
 }`}
 style={{
 backgroundColor: '#ffffff',
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
 WhatsApp <span className="text-red-500">*</span>
 </label>
 <div className="flex gap-3">
 {/* Seletor de País */}
 <button
 type="button"
 onClick={() => setCountryCode(countryCode === 'BR' ? 'US' : 'BR')}
 className="flex items-center justify-center gap-2 px-4 rounded-lg border transition-all hover:scale-105 flex-shrink-0"
 style={{
 backgroundColor: '#ffffff',
 borderColor: fieldErrors.whatsapp 
 ? '#EF4444' 
 : ('#D1D5DB'),
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
 
 {/* Input WhatsApp */}
 <div className="relative flex-1">
 <input
 type="tel"
 name="whatsapp"
 value={formData.whatsapp}
 onChange={handleChange}
 placeholder={countryCode === 'BR' ? '(99) 9 9999-9999' : '(999) 999-9999'}
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none ${
 fieldErrors.whatsapp 
 ? 'border-2 border-red-500 animate-shake' 
 : 'border border-gray-300'
 }`}
 style={{
 backgroundColor: '#ffffff',
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

 {/* Email corporativo */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 E-mail <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 placeholder="E-mail"
 required
 className={`w-full px-4 py-3 rounded-lg text-gray-900 transition-all duration-300 outline-none ${
 fieldErrors.email 
 ? 'border-2 border-red-500 animate-shake' 
 : 'border border-gray-300'
 }`}
 style={{
 backgroundColor: '#ffffff',
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
 Empresa *
 </label>
 <input
 type="text"
 name="company"
 value={formData.company}
 onChange={handleChange}
 placeholder="Empresa"
 required
 className="w-full px-4 py-3 rounded-md text-gray-900 transition-colors"
 style={{
 backgroundColor: '#ffffff',
 border: `1px solid ${'#D1D5DB'}`,
 outline: 'none'
 }}
 />
 </div>

 {/* Cargo */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 Cargo *
 </label>
 <select
 name="role"
 value={formData.role}
 onChange={handleChange}
 required
 className="w-full px-4 py-3 rounded-md text-gray-900 transition-colors"
 style={{
 backgroundColor: '#ffffff',
 border: `1px solid ${'#D1D5DB'}`,
 outline: 'none'
 }}
 >
 <option value="">Selecione seu cargo</option>
 <option value="ceo">CEO / Founder</option>
 <option value="cto">CTO / Tech Lead</option>
 <option value="manager">Gerente / Coordenador</option>
 <option value="developer">Desenvolvedor</option>
 <option value="other">Outro</option>
 </select>
 </div>

 {/* Receita Mensal */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 Receita Mensal *
 </label>
 <select
 name="revenue"
 value={formData.revenue}
 onChange={handleChange}
 required
 className="w-full px-4 py-3 rounded-md text-gray-900 transition-colors"
 style={{
 backgroundColor: '#ffffff',
 border: `1px solid ${'#D1D5DB'}`,
 outline: 'none'
 }}
 >
 <option value="">Selecione a faixa de receita</option>
 <option value="0-10k">Até R$ 10 mil</option>
 <option value="10k-50k">R$ 10 mil - R$ 50 mil</option>
 <option value="50k-100k">R$ 50 mil - R$ 100 mil</option>
 <option value="100k+">Acima de R$ 500 mil</option>
 </select>
 <p className="text-xs text-gray-500 mt-1">
 Isso nos ajuda a personalizar a solução para você
 </p>
 </div>

 {/* Desafio */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 Desafio/Objetivo *
 </label>
 <textarea
 name="challenge"
 value={formData.challenge}
 onChange={handleChange}
 placeholder="Conte-nos sobre seu desafio ou objetivo"
 required
 rows={4}
 className="w-full px-4 py-3 rounded-md text-gray-900 transition-colors resize-none"
 style={{
 backgroundColor: '#ffffff',
 border: `1px solid ${'#D1D5DB'}`,
 outline: 'none'
 }}
 />
 </div>

 {/* Timeline */}
 <div>
 <label className="block text-sm font-medium text-gray-900 mb-2">
 Quando precisa?
 </label>
 <select
 name="timeline"
 value={formData.timeline}
 onChange={handleChange}
 className="w-full px-4 py-3 rounded-md text-gray-900 transition-colors"
 style={{
 backgroundColor: '#ffffff',
 border: `1px solid ${'#D1D5DB'}`,
 outline: 'none'
 }}
 >
 <option value="">Selecione o prazo</option>
 <option value="immediate">Imediato (o quanto antes)</option>
 <option value="short">Curto prazo (1-2 meses)</option>
 <option value="medium">Médio prazo (3-6 meses)</option>
 <option value="long">Longo prazo (6+ meses)</option>
 </select>
 </div>

 {/* Privacy Notice - LGPD */}
 <div className="p-5 rounded-lg border-2" style={{
 backgroundColor: '#f8fafc',
 borderColor: '#e2e8f0'
 }}>
 <h4 className="text-sm font-bold text-gray-900 mb-2">
 Proteção de Dados (LGPD)
 </h4>
 <p className="text-xs text-gray-600 mb-3">
 Seus dados estão seguros conosco:
 </p>
 <div className="space-y-1.5 mb-4">
 <p className="text-xs text-gray-700">
 • Nunca compartilharemos seus dados com terceiros
 </p>
 <p className="text-xs text-gray-700">
 • Você pode solicitar a exclusão a qualquer momento
 </p>
 <p className="text-xs text-gray-700">
 • Usamos seus dados apenas para contato sobre este projeto
 </p>
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
 Concordo com o tratamento dos meus dados conforme a LGPD
 </label>
 </div>
 </div>

 {/* Status Messages */}
 {submitStatus === 'success' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-lg animate-slide-down"
 style={{
 backgroundColor: 'rgba(220, 252, 231, 1)',
 border: `1px solid 'rgba(34, 197, 94, 0.3)'`,
 }}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500 flex-shrink-0 mt-0.5 animate-bounce-in">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <div>
 <p className="text-sm text-green-700 font-semibold">
 ✓ Sucesso!
 </p>
 <p className="text-xs text-green-600 mt-1">
 Recebemos seu contato! Retornaremos em breve.
 </p>
 </div>
 </div>
 )}

 {submitStatus === 'error' && (
 <div 
 className="flex items-start gap-3 p-4 rounded-lg animate-slide-down"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5 animate-bounce-in">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <div>
 <p className="text-sm text-red-700 font-semibold">
 ✗ Erro ao enviar
 </p>
 <p className="text-xs text-red-600 mt-1">
 {errorMessage || 'Ocorreu um erro ao enviar. Tente novamente.'}
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
 {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento'}
 </button>

 </form>
 </div>
 </div>
 );

 return createPortal(modalContent, modalRoot);
};

export default QuoteModal;

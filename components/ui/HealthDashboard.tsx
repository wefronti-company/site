import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const HealthDashboard: React.FC = () => {
 const { t } = useLanguage();
 const [animationStep, setAnimationStep] = React.useState(0);
 const [patientName, setPatientName] = React.useState('');
 const [appointmentDate, setAppointmentDate] = React.useState('');
 const [consultationType, setConsultationType] = React.useState('');
 const [isProcessing, setIsProcessing] = React.useState(false);
 const [isSuccess, setIsSuccess] = React.useState(false);

 const purpleColor = '#a855f7';
 const purpleLight = '#c084fc';
 const purpleDark = '#8b5cf6';

 // Animação de auto-preenchimento
 React.useEffect(() => {
 const interval = setInterval(() => {
 setAnimationStep((prev) => (prev + 1) % 200);
 }, 80);

 return () => clearInterval(interval);
 }, []);

 React.useEffect(() => {
 const fullName = 'João Silva';
 const fullDate = '25/11/2025';
 const fullType = 'Cardiologia';

 if (animationStep < 50) {
 // Digitando nome
 const progress = animationStep / 50;
 const chars = Math.floor(fullName.length * progress);
 setPatientName(fullName.substring(0, chars));
 setAppointmentDate('');
 setConsultationType('');
 setIsProcessing(false);
 setIsSuccess(false);
 } else if (animationStep < 70) {
 // Digitando data
 setPatientName(fullName);
 const progress = (animationStep - 50) / 20;
 const chars = Math.floor(fullDate.length * progress);
 setAppointmentDate(fullDate.substring(0, chars));
 setConsultationType('');
 setIsProcessing(false);
 setIsSuccess(false);
 } else if (animationStep < 90) {
 // Digitando tipo de consulta
 setPatientName(fullName);
 setAppointmentDate(fullDate);
 const progress = (animationStep - 70) / 20;
 const chars = Math.floor(fullType.length * progress);
 setConsultationType(fullType.substring(0, chars));
 setIsProcessing(false);
 setIsSuccess(false);
 } else if (animationStep < 105) {
 // Processando
 setPatientName(fullName);
 setAppointmentDate(fullDate);
 setConsultationType(fullType);
 setIsProcessing(true);
 setIsSuccess(false);
 } else if (animationStep < 150) {
 // Sucesso
 setPatientName(fullName);
 setAppointmentDate(fullDate);
 setConsultationType(fullType);
 setIsProcessing(false);
 setIsSuccess(true);
 } else {
 // Reset
 setPatientName('');
 setAppointmentDate('');
 setConsultationType('');
 setIsProcessing(false);
 setIsSuccess(false);
 }
 }, [animationStep]);

 return (
 <div 
 className="relative w-full h-full flex items-center justify-center"
 style={{ 
 backgroundColor: '#f7f7f7',
 padding: '16px',
 }}
 >
 {/* Container Principal */}
 <div 
 className="w-full"
 style={{
 backgroundColor: '#f7f7f7',

 }}
 >

 {isSuccess ? (
 /* Tela de Sucesso */
 <div className="flex flex-col items-center justify-center py-6">
 {/* Ícone de Check com animação */}
 <div 
 className="relative mb-4"
 style={{
 width: '60px',
 height: '60px',
 backgroundColor: '#f3e8ff',
 borderRadius: '50%',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 }}
 >
 <svg
 width="32"
 height="32"
 viewBox="0 0 24 24"
 fill="none"
 stroke={purpleColor}
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="20 6 9 17 4 12" />
 </svg>
 
 {/* Círculos decorativos animados */}
 <div
 style={{
 position: 'absolute',
 width: '100%',
 height: '100%',
 border: `2px solid ${purpleLight}`,
 borderRadius: '50%',
 animation: 'pulse 2s ease-in-out infinite',
 }}
 />
 </div>

 {/* Mensagem de Sucesso */}
 <h4 
 className="text-lg font-bold mb-2"
 style={{ color: purpleColor }}
 >
 Consulta Agendada!
 </h4>
 <p className="text-sm text-gray-600 text-center">
 Sua consulta foi confirmada com sucesso.<br />
 Enviamos os detalhes para seu e-mail.
 </p>
 </div>
 ) : (
 /* Formulário de Agendamento */
 <div>
 {/* Campo Nome */}
 <div className="mb-3">
 <div
 className="w-full px-3 rounded"
 style={{
 minHeight: '36px',
 display: 'flex',
 alignItems: 'center',
 backgroundColor: '#faf5ff',
 border: `1px solid '#e9d5ff'`,
 borderRadius: '7px',
 color: '#1a1a1a',
 fontSize: '11px',
 }}
 >
 {patientName || (
 <span style={{ color: '#9ca3af' }}>{t.hero.healthDashboard.placeholderName}</span>
 )}
 {patientName && animationStep < 50 && (
 <span 
 className="inline-block w-0.5 h-3 ml-0.5 animate-pulse"
 style={{ backgroundColor: purpleColor }}
 />
 )}
 </div>
 </div>

 {/* Campo Data */}
 <div className="mb-3">
 <div
 className="w-full px-3 rounded"
 style={{
 minHeight: '36px',
 display: 'flex',
 alignItems: 'center',
 backgroundColor: '#faf5ff',
 border: `1px solid '#e9d5ff'`,
 borderRadius: '7px',
 color: '#1a1a1a',
 fontSize: '11px',
 }}
 >
 {appointmentDate || (
 <span style={{ color: '#9ca3af' }}>{t.hero.healthDashboard.placeholderDate}</span>
 )}
 {appointmentDate && animationStep >= 50 && animationStep < 70 && (
 <span 
 className="inline-block w-0.5 h-3 ml-0.5 animate-pulse"
 style={{ backgroundColor: purpleColor }}
 />
 )}
 </div>
 </div>

 {/* Campo Tipo de Consulta */}
 <div className="mb-4">
 <div
 className="w-full px-3 rounded"
 style={{
 minHeight: '36px',
 display: 'flex',
 alignItems: 'center',
 backgroundColor: '#faf5ff',
 border: `1px solid '#e9d5ff'`,
 borderRadius: '7px',
 color: '#1a1a1a',
 fontSize: '11px',
 }}
 >
 {consultationType || (
 <span style={{ color: '#9ca3af' }}>{t.hero.healthDashboard.placeholderSpecialty}</span>
 )}
 {consultationType && animationStep >= 70 && animationStep < 90 && (
 <span 
 className="inline-block w-0.5 h-3 ml-0.5 animate-pulse"
 style={{ backgroundColor: purpleColor }}
 />
 )}
 </div>
 </div>

 {/* Botão Agendar */}
 <button
 disabled={isProcessing}
 className="w-full font-semibold text-white transition-all duration-300"
 style={{
 padding: '10px 0',
 borderRadius: '7px',
 backgroundColor: isProcessing 
 ? ('#d1d5db')
 : purpleColor,
 cursor: isProcessing ? 'not-allowed' : 'pointer',
 fontSize: '12px',
 opacity: isProcessing ? 0.6 : 1,
 }}
 >
 {isProcessing ? (
 <div className="flex items-center justify-center gap-2">
 <svg
 className="animate-spin"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 >
 <circle
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 strokeOpacity="0.25"
 />
 <path
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
 />
 </svg>
 <span>Processando...</span>
 </div>
 ) : (
 t.hero.healthDashboard.scheduleButton
 )}
 </button>

 {/* Badge de Segurança */}
 <div className="flex items-center justify-center gap-1.5 mt-3">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
 <path
 d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
 stroke={'#a855f7'}
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 <span 
 className="text-[9px] font-medium"
 style={{ color: '#8b5cf6' }}
 >
 {t.hero.healthDashboard.dataProtected}
 </span>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default HealthDashboard;

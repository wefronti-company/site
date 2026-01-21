import React from 'react';
import Link from 'next/link';
import Logo from '../../components/ui/Logo';
import { colors } from '../../styles/colors';
import { ArrowRight, ArrowUpRight, ArrowUp, ShieldCheck } from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {

 const scrollToTop = () => {
 window.scrollTo({
 top: 0,
 behavior: 'smooth'
 });
 };

 return (
 <footer 
 className="w-full transition-colors"
 style={{
 backgroundColor: colors.background.dark, borderTop: `1px solid ${colors.neutral.borderDark}`}}
 >
 <div className="px-8 md:px-16 lg:px-24 pt-16 pb-12 md:pt-20 md:pb-14 relative" style={{ backgroundColor: colors.background.dark }}>
 <div className="w-full max-w-3xl md:max-w-6xl mx-auto" >


   {/* Main layout — 4 columns (desktop) */}
   <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-16 md:mb-20"> 

     {/* 1 — Logo + slogan */}
     <div className="flex flex-col gap-6">
       <Logo />
       <p className="text-sm max-w-[20rem]" style={{ color: colors.text.dark, opacity: 0.9 }}>
         Avenida Cristovao Colombo, 2144, Sala 408 Andar 3, Floresta • Porto Alegre, RS
       </p>
     </div>

     {/* 2 — Navegação */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.text.dark }}>Navegação</h4>
       <ul className="flex flex-col gap-4">
         <li>
           <button
             className="inline-flex items-center gap-3 text-sm bg-transparent border-0 p-0 m-0 cursor-pointer"
             style={{ color: colors.text.light }}
             onClick={() => {
               if (window.location.pathname === '/') {
                 const el = document.querySelector('#hero');
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
               } else {
                 window.location.href = '/#hero';
               }
             }}
           >
             <span>Início</span>
             <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
           </button>
         </li>
         <li>
           <button
             className="inline-flex items-center gap-3 text-sm bg-transparent border-0 p-0 m-0 cursor-pointer"
             style={{ color: colors.text.light }}
             onClick={() => {
               if (window.location.pathname === '/') {
                 const el = document.querySelector('#clients');
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
               } else {
                 window.location.href = '/#clients';
               }
             }}
           >
             <span>Clientes</span>
             <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
           </button>
         </li>
         <li>
           <button
             className="inline-flex items-center gap-3 text-sm bg-transparent border-0 p-0 m-0 cursor-pointer"
             style={{ color: colors.text.light }}
             onClick={() => {
               if (window.location.pathname === '/') {
                 const el = document.querySelector('#sobre');
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
               } else {
                 window.location.href = '/#sobre';
               }
             }}
           >
             <span>Sobre</span>
             <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
           </button>
         </li>
         <li>
           <button
             className="inline-flex items-center gap-3 text-sm bg-transparent border-0 p-0 m-0 cursor-pointer"
             style={{ color: colors.text.light }}
             onClick={() => {
               if (window.location.pathname === '/') {
                 const el = document.querySelector('#contato');
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
               } else {
                 window.location.href = '/#contato';
               }
             }}
           >
             <span>Contato</span>
             <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
           </button>
         </li>
         <li>
           <button
             className="inline-flex items-center gap-3 text-sm bg-transparent border-0 p-0 m-0 cursor-pointer"
             style={{ color: colors.text.light }}
             onClick={() => {
               if (window.location.pathname === '/') {
                 const el = document.querySelector('#faq');
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
               } else {
                 window.location.href = '/#faq';
               }
             }}
           >
             <span>FAQ</span>
             <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
           </button>
         </li>
       </ul>
     </div>

     {/* 3 — Conecte-se conosco */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.text.dark }}>Conecte-se</h4>
       <div className="flex flex-col gap-4">
         <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
           <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden>
             <FaInstagram />
           </span>
           <span>Instagram</span>
         </a>
         <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
           <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden>
            <FaLinkedin />
           </span>
           <span>LinkedIn</span>
         </a>
       </div>
     </div>

     {/* 4 — Fale conosco + Legal */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.text.dark }}>Fale conosco</h4>
       <div className="flex flex-col gap-4 mb-8">
         <a href="mailto:contato@wefronti.com" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Enviar e‑mail para contato@wefronti.com">
           <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden>
             <FaEnvelope />
           </span>
           <span>contato@wefronti.com</span>
         </a>
         <a href="https://wa.me/message/3V45SAJMLIJJJ1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Abrir conversa no WhatsApp">
           <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden>
             <img src="/images/icons/icon-fran.svg" alt="Ícone Fran" className="w-6 h-6 object-contain" />
           </span>
           <span>Falar com a Fran</span>
         </a>
       </div>

       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.text.dark }}>Legal</h4>
       <div>
         <Link href="/politica-privacidade" className="text-sm inline-flex items-center gap-2" style={{ color: colors.text.light }}>
           Política de Privacidade
           <ArrowRight size={14} className="-rotate-45 ml-auto" aria-hidden />
         </Link>
       </div>
     </div>

   </div>

    </div>
 </div>

    {/* Divider - Full width */}
 <div 
 className="w-full h-px"
 style={{
 backgroundColor: colors.background.dark, borderTop: `1px solid ${colors.neutral.borderDark}`
 }}
 />

 <div className="px-8 md:px-16 lg:px-24 py-8">
 <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
 <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
   <div className="text-sm text-left" style={{ color: colors.text.dark, opacity: 0.6 }}>
     CNPJ: 64.507.638/0001-04 • Wefronti Tecnologia Ltda
   </div>

   <div className="text-sm text-left md:text-center" style={{ color: colors.text.dark, opacity: 0.6 }}>
     © {new Date().getFullYear()} Wefronti. Todos os direitos reservados.
   </div>

   <div className="flex items-center justify-end">
     <button onClick={scrollToTop} aria-label="Voltar ao topo" className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ background: colors.neutral.gray, color: colors.icons.dark }}>
       <ArrowUp size={18} />
     </button>
   </div>
 </div>
 </div>
 </div>

 </footer>
 );
};

export default Footer;

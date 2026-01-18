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
 backgroundColor: colors.primary.black,
 borderTopLeftRadius: '20px', borderTopRightRadius: '20px',}}
 >
 <div className="px-4 md:px-8 lg:px-16 py-12 md:py-16 relative">
 <div className="w-full max-w-[1400px] mx-auto" >

   {/* Main layout — 5 columns (desktop) */}
   <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">

     {/* 1 — Logo + slogan */}
     <div className="flex flex-col gap-4">
       <Logo />
       <p className="text-sm max-w-[20rem]" style={{ color: colors.text.light, opacity: 0.9 }}>
         Projetamos produtos digitais com propósito estratégia, tecnologia e entrega.
       </p>
       <p className="text-xs" style={{ color: colors.neutral.grayHover }}>Sede administrativa: Porto Alegre, RS (Atendimento remoto)</p>
     </div>

     {/* 2 — Navegação */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.neutral.grayHover }}>Navegação</h4>
       <ul className="flex flex-col gap-3">
         {[
           ['Início', '/'],
           ['O que fazemos', '/solucoes'],
           ['Sobre nós', '/sobre-nos'],
           ['Casos de sucesso', '/projetos'],
           ['Contato', '/contato'],
           ['FAQ', '/faq']
         ].map(([label, href]) => (
           <li key={String(label)}>
             <Link href={String(href)} className="inline-flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
               <span>{label}</span>
               <ArrowRight size={16} className="-rotate-45 ml-auto" aria-hidden />
             </Link>
           </li>
         ))}
       </ul>
     </div>

     {/* 3 — Conecte-se conosco */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.neutral.grayHover }}>Conecte-se conosco</h4>
       <div className="flex flex-col gap-3">
         <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
           <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.neutral.grayHover }} aria-hidden>
             <FaInstagram />
           </span>
           <span>Instagram</span>
         </a>
         <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
           <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.neutral.grayHover }} aria-hidden>
            <FaLinkedin />
           </span>
           <span>LinkedIn</span>
         </a>
       </div>
     </div>

     {/* 4 — Fale conosco */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.neutral.grayHover }}>Fale conosco</h4>
       <div className="flex flex-col gap-3">
         <a href="mailto:contato@wefronti.com.br" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Enviar e‑mail para contato@wefronti.com.br">
           <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.neutral.grayHover }} aria-hidden>
             <FaEnvelope />
           </span>
           <span>contato@wefronti.com.br</span>
         </a>
         <a href="https://wa.me/message/GMAON4GDQH3NA1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Abrir conversa no WhatsApp">
           <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.neutral.grayHover }} aria-hidden>
             <FaWhatsapp />
           </span>
           <span>Falar por WhatsApp</span>
         </a>
       </div>
     </div>

     {/* 5 — Site seguro */}
     <div>
       <h4 className="text-sm font-regular mb-3 uppercase" style={{ color: colors.neutral.grayHover }}>Legal</h4>
      
         <ul className="mt-3 flex flex-col gap-2">
           <li>
             <Link href="/termos-de-uso" className="text-sm inline-flex items-center gap-2" style={{ color: colors.text.light }}>
               Termos de Uso
               <ArrowRight size={14} className="-rotate-45 ml-auto" aria-hidden />
             </Link>
           </li>
           <li>
             <Link href="/politica-privacidade" className="text-sm inline-flex items-center gap-2" style={{ color: colors.text.light }}>
               Política de Privacidade
               <ArrowRight size={14} className="-rotate-45 ml-auto" aria-hidden />
             </Link>
           </li>
         </ul>
       </div>
     </div>

    </div>

    {/* Divider */}
 <div 
 className="w-full h-px mb-8"
 style={{
 backgroundColor: colors.borderDark
 }}
 />

 
 <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
   <div className="text-sm text-left" style={{ color: colors.neutral.grayHover, opacity: 0.6 }}>
     CNPJ: 64.507.638/0001-04 • Wefronti Tecnologia Ltda
   </div>

   <div className="text-sm text-center" style={{ color: colors.neutral.grayHover, opacity: 0.6 }}>
     © {new Date().getFullYear()} Wefronti. Todos os direitos reservados.
   </div>

   <div className="flex items-center justify-end">
     <button onClick={scrollToTop} aria-label="Voltar ao topo" className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: colors.whiteColor }}>
       <ArrowUp size={18} />
     </button>
   </div>
 </div>

 </div>
 </footer>
 );
};

export default Footer;

import React from 'react';
import Link from 'next/link';
import Logo from '../../components/ui/Logo';
import { colors } from '../../styles/colors';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') {
      window.location.href = '/#hero';
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      setTimeout(() => {
        const retry = document.getElementById(id);
        if (retry) retry.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.location.href = '/#' + id;
      }, 700);
    } else {
      e.preventDefault();
      window.location.href = '/#' + id;
    }
  };

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: colors.background.dark,
        borderTop: `1px solid ${colors.neutral.borderDark}`,
      }}
    >
      <div style={{ backgroundColor: colors.background.dark }}>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <Logo />
              <p className="text-sm max-w-20rem" style={{ color: colors.text.dark, opacity: 0.9 }}>
                Avenida Cristovao Colombo, 2144, Sala 408 Andar 3, Floresta, Porto Alegre, RS
              </p>
            </div>

            <div>
              <h4 className="footer-title" style={{ color: colors.text.dark }}>Navegação</h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <a href="/#hero" className="footer-link" style={{ color: colors.text.light }} onClick={(e) => handleNavClick(e, 'hero')} aria-label="Ir para Início">
                    <span>Início</span>
                    <ArrowRight size={16} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="/#clients" className="footer-link" style={{ color: colors.text.light }} onClick={(e) => handleNavClick(e, 'clients')} aria-label="Ir para Clientes">
                    <span>Clientes</span>
                    <ArrowRight size={16} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="/#contato" className="footer-link" style={{ color: colors.text.light }} onClick={(e) => handleNavClick(e, 'contato')} aria-label="Ir para Contato">
                    <span>Contato</span>
                    <ArrowRight size={16} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="/#sobre" className="footer-link" style={{ color: colors.text.light }} onClick={(e) => handleNavClick(e, 'sobre')} aria-label="Ir para Sobre">
                    <span>Sobre</span>
                    <ArrowRight size={16} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="footer-link" style={{ color: colors.text.light }} onClick={(e) => handleNavClick(e, 'faq')} aria-label="Ir para FAQ">
                    <span>FAQ</span>
                    <ArrowRight size={16} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title" style={{ color: colors.text.dark }}>Conecte-se</h4>
              <div className="flex flex-col gap-4">
                <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
                  <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden><FaInstagram /></span>
                  <span>Instagram</span>
                </a>
                <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }}>
                  <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden><FaLinkedin /></span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-title" style={{ color: colors.text.dark }}>Fale conosco</h4>
              <div className="flex flex-col gap-4" style={{ marginBottom: '2rem' }}>
                <a href="mailto:projetos@wefronti.com" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Enviar e‑mail para projetos@wefronti.com">
                  <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden><FaEnvelope /></span>
                  <span>projetos@wefronti.com</span>
                </a>
                <a href="https://wa.me/message/3V45SAJMLIJJJ1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm" style={{ color: colors.text.light }} aria-label="Abrir conversa no WhatsApp">
                  <span className="w-8 h-8 flex items-center justify-center rounded-md -ml-2" style={{ color: colors.icons.light }} aria-hidden>
                    <img src="/images/icons/icon-fran-whatsapp.svg?v=2" alt="Ícone Fran" className="w-6 h-6 object-contain" />
                  </span>
                  <span>Falar com a Fran</span>
                </a>
              </div>
              <h4 className="footer-title" style={{ color: colors.text.dark }}>Legal</h4>
              <div>
                <Link href="/politica-privacidade" className="text-sm inline-flex items-center gap-2" style={{ color: colors.text.light }}>
                  Política de Privacidade
                  <ArrowRight size={14} className="-rotate-45 ml-auto" style={{ color: colors.text.dark }} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 1, borderTop: `1px solid ${colors.neutral.borderDark}` }} />

      <div className="footer-bottom">
        <div style={{ maxWidth: '72rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <div className="footer-bottom-grid">
            <div className="text-sm text-left" style={{ color: colors.text.dark, opacity: 0.6 }}>
              CNPJ: 64.507.638/0001-04 | Wefronti Tecnologia Ltda
            </div>
            <div className="text-sm text-left md:text-center" style={{ color: colors.text.dark, opacity: 0.6 }}>
              © {new Date().getFullYear()} Wefronti. Todos os direitos reservados.
            </div>
            <div className="flex items-center justify-end">
              <button type="button" onClick={scrollToTop} aria-label="Voltar ao topo" className="footer-btn-top" style={{ background: colors.blue.primary, color: colors.text.light, zIndex: 50 }}>
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

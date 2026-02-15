import React from 'react';
import Link from 'next/link';
import Logo from '../../components/ui/Logo';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';

const { colors, spacing, fontSizes } = theme;
const containerMaxWidth = 1152;

const Footer: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);

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

  const footerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.neutral.borderDark}`,
  };

  const innerStyle: React.CSSProperties = {
    padding: `${spacing[12]}px ${spacing[8]}px ${spacing[8]}px`,
    maxWidth: containerMaxWidth,
    margin: '0 auto',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMd ? 'repeat(4, 1fr)' : '1fr',
    gap: spacing[12],
    marginBottom: spacing[12],
  };

  const colStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const titleStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    fontWeight: 400,
    marginBottom: spacing[3],
    textTransform: 'uppercase' as const,
    color: colors.text.dark,
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[3],
    fontSize: fontSizes.sm,
    background: 'transparent',
    border: 0,
    padding: 0,
    margin: 0,
    textDecoration: 'none',
    cursor: 'pointer',
    color: colors.text.light,
  };

  const bottomStyle: React.CSSProperties = {
    padding: `${spacing[8]}px ${spacing[8]}px`,
  };

  const bottomGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMd ? 'repeat(3, 1fr)' : '1fr',
    gap: spacing[2],
    alignItems: 'center',
    maxWidth: 1152,
    margin: '0 auto',
    paddingLeft: spacing[8],
    paddingRight: spacing[8],
  };

  const btnTopStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    border: 0,
    borderRadius: theme.radii.md,
    background: colors.blue.primary,
    color: colors.text.light,
    cursor: 'pointer',
    zIndex: 50,
  };

  const iconWrapStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginLeft: -spacing[2],
    color: colors.icons.light,
  };

  const smallTextStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.dark,
    opacity: 0.6,
  };

  return (
    <footer style={footerStyle}>
      <div style={{ backgroundColor: colors.background.dark }}>
        <div style={innerStyle}>
          <div style={gridStyle}>
            <div style={colStyle}>
              <Logo />
              <p style={{ ...smallTextStyle, maxWidth: '20rem', opacity: 0.9 }}>
                Avenida Cristovao Colombo, 2144, Sala 408 Andar 3, Floresta, Porto Alegre, RS
              </p>
            </div>

            <div>
              <h4 style={titleStyle}>Navegação</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                {[
                  { id: 'hero', label: 'Início' },
                  { id: 'clients', label: 'Clientes' },
                  { id: 'contato', label: 'Contato' },
                  { id: 'sobre', label: 'Sobre' },
                  { id: 'faq', label: 'FAQ' },
                ].map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`/#${id}`}
                      style={linkStyle}
                      onClick={(e) => handleNavClick(e, id)}
                      aria-label={`Ir para ${label}`}
                    >
                      <span>{label}</span>
                      <ArrowRight size={16} style={{ color: colors.text.dark, transform: 'rotate(-45deg)', marginLeft: 'auto' }} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={titleStyle}>Conecte-se</h4>
              <div style={{ ...colStyle, marginBottom: spacing[8] }}>
                <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, gap: spacing[3] }}>
                  <span style={iconWrapStyle} aria-hidden><FaInstagram /></span>
                  <span>Instagram</span>
                </a>
                <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, gap: spacing[3] }}>
                  <span style={iconWrapStyle} aria-hidden><FaLinkedin /></span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div>
              <h4 style={titleStyle}>Fale conosco</h4>
              <div style={{ ...colStyle, marginBottom: spacing[8] }}>
                <a href="mailto:projetos@wefronti.com" style={{ ...linkStyle, gap: spacing[3] }} aria-label="Enviar e‑mail para projetos@wefronti.com">
                  <span style={iconWrapStyle} aria-hidden><FaEnvelope /></span>
                  <span>projetos@wefronti.com</span>
                </a>
                <a href="https://wa.me/message/3V45SAJMLIJJJ1" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, gap: spacing[3] }} aria-label="Abrir conversa no WhatsApp">
                  <span style={iconWrapStyle} aria-hidden>
                    <img src="/images/icons/icon-fran-whatsapp.svg?v=2" alt="Ícone Fran" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  </span>
                  <span>Falar com a Fran</span>
                </a>
              </div>
              <h4 style={titleStyle}>Legal</h4>
              <div>
                <Link href="/politica-privacidade" style={{ ...linkStyle, gap: spacing[2], fontSize: fontSizes.sm }}>
                  Política de Privacidade
                  <ArrowRight size={14} style={{ color: colors.text.dark, transform: 'rotate(-45deg)' }} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 1, borderTop: `1px solid ${colors.neutral.borderDark}` }} />

      <div style={bottomStyle}>
        <div style={bottomGridStyle}>
          <div style={{ ...smallTextStyle, textAlign: 'left' }}>
            CNPJ: 64.507.638/0001-04 | Wefronti Tecnologia Ltda
          </div>
          <div style={{ ...smallTextStyle, textAlign: isMd ? 'center' : 'left' }}>
            © {new Date().getFullYear()} Wefronti. Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button type="button" onClick={scrollToTop} aria-label="Voltar ao topo" style={btnTopStyle}>
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

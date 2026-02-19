import React from 'react';
import Link from 'next/link';
import Logo from '../../components/ui/Logo';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const SOCIAL_LINKS = [
  { href: 'https://instagram.com/wefronti', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://linkedin.com/company/wefronti', label: 'LinkedIn', Icon: FaLinkedin },
] as const;

const Footer: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const footerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.background.dark,
 
  };

  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const innerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: containerMaxWidth.wide,
    margin: '0 auto',
    paddingTop: spacing[12],
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const innerBottomStyle: React.CSSProperties = {
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  };

  const mainRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[8],
    marginBottom: spacing[12],
  };

  const rightBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: spacing[8],
  };

  const networksRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing[4],
  };

  const networksLabelStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    fontWeight: 500,
    color: colors.text.light,
    margin: 0,
  };

  const socialCircleStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: `1px solid ${colors.neutral.borderDark}`,
    background: 'transparent',
    color: colors.text.light,
    textDecoration: 'none',
    transition: 'border-color 0.2s, color 0.2s',
  };

  const privacyLinkStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    textDecoration: 'underline',
    color: colors.text.light,
    opacity: 0.9,
  };

  const bottomRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMd ? '1fr 1fr' : '1fr',
    gap: spacing[2],
    alignItems: 'center',
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
          <div style={mainRowStyle}>
            <Logo />
            <div style={rightBlockStyle}>
              <div style={networksRowStyle}>
                <span style={networksLabelStyle}>Nossas redes</span>
                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialCircleStyle}
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
                <Link href="/politica-privacidade" style={privacyLinkStyle}>
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', borderTop: `1px solid ${colors.neutral.borderDark}` }} />

        <div style={innerStyle}>
          <div style={innerBottomStyle}>
            <div style={bottomRowStyle}>
              <div style={{ ...smallTextStyle, textAlign: 'left' }}>
                CNPJ: 64.507.638/0001-04 | Wefronti Tecnologia Ltda
              </div>
              <div style={{ ...smallTextStyle, textAlign: isMd ? 'right' : 'left' }}>
                © {new Date().getFullYear()}. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonAppbar from '../ui/ButtonAppbar';
import Logo from '../ui/Logo';
import LanguageSelector from '../ui/LanguageSelector';
import { colors } from '../../styles/colors';
import { useLanguage } from '../../contexts/LanguageContext';

const AppBar: React.FC = () => {
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { t, language, setLanguage } = useLanguage();	const navItems = [
		{ label: t.appBar.nav.clients, href: '#clients' },
		{ label: t.appBar.nav.services, href: '#services' },
		{ label: t.appBar.nav.projects, href: '#projects' },
		{ label: t.appBar.nav.faq, href: '#faq' }
	];

	return (
		<header 
			className="w-full sticky top-0 z-40 bg-custom-white border-b transition-colors"
			style={{ borderBottomColor: colors.borderLight }}
		>
			<div className="px-4 md:px-8 lg:px-16">
				<div className="h-24 md:h-24 flex items-center justify-between w-full max-w-[1400px] mx-auto">
					{/* Logo */}
					<div className="scale-65 md:scale-100">
						<Logo />
					</div>
					
					{/* Desktop Nav - Hidden on mobile */}
					<nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-gray-200 p-1" style={{ borderRadius: '7px' }}>
						{navItems.map(item => {
							return (
								<a
									key={item.label}
									href={item.href}
									onClick={(e) => {
										e.preventDefault();
										const element = document.querySelector(item.href);
										if (element) {
											element.scrollIntoView({ behavior: 'smooth', block: 'start' });
										}
									}}
									className="px-6 h-9 flex items-center text-sm font-medium transition-all text-gray-600 hover:text-black hover:bg-gray-300 cursor-pointer"
									style={{ borderRadius: '7px' }}
								>
									{item.label}
								</a>
							);
						})}
					</nav>
					
					{/* Desktop Right section - Hidden on mobile */}
					<div className="hidden lg:flex items-center gap-3">
						<LanguageSelector />
						<ButtonAppbar />
					</div>

					{/* Mobile Right section - Theme toggle + Hamburger */}
					<div className="lg:hidden flex items-center gap-2">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
							aria-label="Toggle menu"
						>
							<span 
								className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
									mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
								}`}
							/>
							<span 
								className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
									mobileMenuOpen ? 'opacity-0' : ''
								}`}
							/>
							<span 
								className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
									mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div 
				className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				<nav className="px-4 pb-6 flex flex-col gap-3">
					{/* Navigation Links */}
					{navItems.map(item => {
						return (
							<a
								key={item.label}
								href={item.href}
								onClick={(e) => {
									e.preventDefault();
									setMobileMenuOpen(false);
									const element = document.querySelector(item.href);
									if (element) {
										element.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}
								}}
								className="px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-600 hover:bg-gray-200 cursor-pointer"
							>
								{item.label}
							</a>
						);
					})}
					
					{/* Language Selection - Grid 2 columns */}
					<div className="grid grid-cols-2 gap-3 mt-4">
						<button 
							onClick={() => {
								setLanguage('pt-BR');
							}}
							className="px-4 py-3 rounded-lg text-sm font-medium transition-all shadow-sm"
							style={{
								backgroundColor: language === 'pt-BR' ? colors.blueColor : 'transparent',
								color: language === 'pt-BR' ? colors.whiteColor : '#4B5563'
							}}
						>
							<span className="flex items-center justify-center gap-2">
								<span>BR</span>
								<span className="text-xs opacity-70">Português</span>
							</span>
						</button>
						<button 
							onClick={() => {
								setLanguage('en-US');
							}}
							className="px-4 py-3 rounded-lg text-sm font-medium transition-all shadow-sm"
							style={{
								backgroundColor: language === 'en-US' ? colors.blueColor : 'transparent',
								color: language === 'en-US' ? colors.whiteColor : '#4B5563'
							}}
						>
							<span className="flex items-center justify-center gap-2">
								<span>EN</span>
								<span className="text-xs opacity-70">English</span>
							</span>
						</button>
					</div>

					{/* Social Media - Grid 2 columns */}
					<div className="grid grid-cols-2 gap-3">
						<a 
							href="https://linkedin.com" 
							target="_blank" 
							rel="noopener noreferrer"
							className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
							</svg>
							<span>LinkedIn</span>
						</a>
						<a 
							href="https://instagram.com" 
							target="_blank" 
							rel="noopener noreferrer"
							className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
							<span>Instagram</span>
						</a>
					</div>

					{/* Contact Button */}
					<div className="mt-2">
						<button
							type="button"
							onClick={() => { setMobileMenuOpen(false); router.push('/form'); }}
							className="w-full px-5 py-3 text-base font-medium text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
							style={{ borderRadius: '7px', backgroundColor: colors.blueColor }}
						>
							Iniciar um projeto
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default AppBar;

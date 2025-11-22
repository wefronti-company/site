import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonAppbar from './buttonAppbar';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { colors } from '../styles/colors';

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Templates', href: '/templates' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'About', href: '/about' }
];

const AppBar: React.FC = () => {
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	
	return (
		<header 
			className="w-full sticky top-0 z-40 bg-custom-white dark:bg-custom-black border-b dark:border-white/5"
			style={{ borderBottomColor: colors.borderLight }}
		>
			<div className="px-4 md:px-8 lg:px-16">
				<div className="h-16 md:h-20 flex items-center justify-between w-full max-w-[1400px] mx-auto">
					{/* Logo */}
					<Logo />
					
					{/* Desktop Nav - Hidden on mobile */}
					<nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full p-1">
						{navItems.map(item => {
							const isActive = router.pathname === item.href;
							return (
								<Link
									key={item.label}
									href={item.href}
									className={`px-6 h-9 flex items-center rounded-full text-sm font-medium transition-all ${
										isActive 
											? 'shadow-sm' 
											: 'text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/5'
									}`}
									style={isActive ? { backgroundColor: colors.blackColor, color: colors.whiteColor } : undefined}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
					
					{/* Desktop Right section - Hidden on mobile */}
					<div className="hidden lg:flex items-center gap-3">
						<ThemeToggle />
						<LanguageSelector />
						<ButtonAppbar label="Contact" />
					</div>

					{/* Mobile Hamburger Menu */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
						aria-label="Toggle menu"
					>
						<span 
							className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
								mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
							}`}
						/>
						<span 
							className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
								mobileMenuOpen ? 'opacity-0' : ''
							}`}
						/>
						<span 
							className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${
								mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
							}`}
						/>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div 
				className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				<nav className="px-4 pb-4 flex flex-col gap-2">
					{navItems.map(item => {
						const isActive = router.pathname === item.href;
						return (
							<Link
								key={item.label}
								href={item.href}
								onClick={() => setMobileMenuOpen(false)}
								className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
									isActive 
										? 'shadow-sm' 
										: 'text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/5'
								}`}
								style={isActive ? { backgroundColor: colors.blackColor, color: colors.whiteColor } : undefined}
							>
								{item.label}
							</Link>
						);
					})}
					
					{/* Mobile actions */}
					<div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-white/10 mt-2">
						<ThemeToggle />
						<LanguageSelector />
						<ButtonAppbar label="Contact" />
					</div>
				</nav>
			</div>
		</header>
	);
};

export default AppBar;

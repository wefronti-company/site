import React from 'react';
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
	
	return (
		<header className="w-full sticky top-0 z-40 bg-custom-white dark:bg-custom-black border-b border-white/5 dark:border-white/5">
			<div className="px-16">
				<div className="h-20 flex items-center justify-between w-full max-w-[1400px] mx-auto">
					{/* Logo */}
					<Logo />
					
					{/* Nav centered */}
					<nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full p-1">
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
					
					{/* Right section: icons + contact */}
					{/* Right section: icons + contact */}
					<div className="flex items-center gap-3">
						{/* Theme toggle (sol/lua) */}
						<ThemeToggle />
						
						{/* Language selector */}
						<LanguageSelector />
						
						{/* Contact button */}
						<ButtonAppbar label="Contact" />
					</div>
				</div>
			</div>
		</header>
	);
};

export default AppBar;

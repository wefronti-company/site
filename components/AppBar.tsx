import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonAppbar from './buttonAppbar';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Templates', href: '/templates' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'About', href: '/about' }
];

const AppBar: React.FC = () => {
	const router = useRouter();
	
	return (
		<header className="w-full sticky top-0 z-40 bg-black dark:bg-black border-b border-white/5 dark:border-white/5 bg-white">
			<div className="px-16">
				<div className="h-20 flex items-center justify-between w-full max-w-[1400px] mx-auto">
					{/* Logo */}
					<Logo />
					
					{/* Nav centered */}
					<nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1a1a1a] dark:bg-[#1a1a1a] bg-gray-100 rounded-full p-1">
						{navItems.map(item => {
							const isActive = router.pathname === item.href;
							return (
								<Link
									key={item.label}
									href={item.href}
									className={`px-6 h-9 flex items-center rounded-full text-sm font-medium transition-all ${
										isActive 
											? 'bg-[#2a2a2a] dark:bg-[#2a2a2a] bg-white text-white dark:text-white text-black shadow-sm' 
											: 'text-white/60 dark:text-white/60 text-gray-600 hover:text-white dark:hover:text-white hover:text-black hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-200'
									}`}
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
						<button className="flex items-center gap-1.5 px-2 h-9 text-white/60 dark:text-white/60 text-gray-600 hover:text-white dark:hover:text-white hover:text-black transition-colors">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="12" cy="12" r="10"/>
								<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
							</svg>
							<span className="text-sm font-medium">EN</span>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<polyline points="6 9 12 15 18 9"/>
							</svg>
						</button>
						
						{/* Contact button */}
						<ButtonAppbar label="Contact" />
					</div>
				</div>
			</div>
		</header>
	);
};

export default AppBar;

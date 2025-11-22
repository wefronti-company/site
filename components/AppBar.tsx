import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonAppbar from './buttonAppbar';

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Templates', href: '/templates' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'About', href: '/about' }
];

const AppBar: React.FC = () => {
	const router = useRouter();
	
	return (
		<header className="w-full sticky top-0 z-40 bg-black border-b border-white/5">
			<div className="px-16">
				<div className="h-16 flex items-center justify-between w-full max-w-[1400px] mx-auto">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 select-none hover:opacity-80 transition-opacity">
						<svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-white">
							<path d="M16 4L4 28H12L16 20L20 28H28L16 4Z" fill="currentColor"/>
						</svg>
						<span className="text-base font-semibold tracking-tight text-white">niq-ui</span>
					</Link>
					
					{/* Nav centered */}
					<nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1a1a1a] rounded-full p-1">
						{navItems.map(item => {
							const isActive = router.pathname === item.href;
							return (
								<Link
									key={item.label}
									href={item.href}
									className={`px-6 h-9 flex items-center rounded-full text-sm font-medium transition-all ${
										isActive 
											? 'bg-[#2a2a2a] text-white' 
											: 'text-white/60 hover:text-white hover:bg-white/5'
									}`}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
					
					{/* Right section: icons + contact */}
					<div className="flex items-center gap-3">
						{/* X (Twitter) */}
						<button className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</button>
						
						{/* GitHub */}
						<button className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
							</svg>
						</button>
						
						{/* YouTube */}
						<button className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</button>
						
						{/* Language selector */}
						<button className="flex items-center gap-1.5 px-2 h-9 text-white/60 hover:text-white transition-colors">
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

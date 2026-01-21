import React from 'react';
import Link from 'next/link';
import Logo from '../ui/Logo';
import { useRouter } from 'next/router';
import { colors } from '../../styles/colors';
import { Clipboard, Users, Settings } from 'lucide-react';

const nav = [
  { key: 'solicitations', label: 'Solicitações', href: '/painel-admin?tab=solicitations', icon: Clipboard },
  { key: 'users', label: 'Usuários', href: '/painel-admin?tab=users', icon: Users },
  { key: 'settings', label: 'Configurações', href: '/painel-admin?tab=settings', icon: Settings },
];

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const active = (key: string) => {
    const q = String(router.query.tab || 'solicitations');
    return q === key;
  };

  return (
    <aside className="flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-6 shrink-0 px-4" style={{ color: colors.text.light, borderRight: `1px solid ${colors.neutral.borderDark}` }}>
      {/* Logo area */}
      <div className="mt-6 pt-4 w-full relative pb-6">
        <div style={{ position: 'absolute', left: '-1rem', right: '-1rem', bottom: 0, borderBottom: `1px solid ${colors.neutral.borderDark}` }} />
        <div className="flex items-center justify-start w-full px-4">
          <Logo isDark={false} />
        </div>
      </div>

      <div className="mb-3 px-2">
        <span className="text-xs uppercase tracking-wider text-gray-400">Dashboard</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {nav.map((n) => {
            const Icon = n.icon as any;
            const isActive = active(n.key);
            return (
              <li key={n.key}>
                <Link href={n.href} legacyBehavior>
                  <a
                    className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded transition-all text-sm ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-200 hover:bg-gray-800'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded ${isActive ? 'bg-gray-100 text-black' : 'bg-transparent text-gray-300'}`}>
                      <Icon size={16} />
                    </span>
                    <span>{n.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-12 px-3" style={{ paddingTop: '12px' }}>
        <button
          onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.replace('/painel-admin/login'); }}
          className="w-full px-3 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

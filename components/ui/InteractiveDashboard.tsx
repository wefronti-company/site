import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { ptBR } from '../../locales/pt-BR';

interface ChartData {
 month: string;
 value: number;
}

const InteractiveDashboard: React.FC = () => {
 const [activeMetric, setActiveMetric] = useState<'revenue' | 'users' | 'growth'>('revenue');
 const [revenue, setRevenue] = useState(247850);
 const [isHovering, setIsHovering] = useState(false);
 const t = ptBR;

 // Dados do gráfico
 const chartData: ChartData[] = [
 { month: t.hero.dashboard.months.jan, value: 38 },
 { month: t.hero.dashboard.months.feb, value: 72 },
 { month: t.hero.dashboard.months.mar, value: 55 },
 { month: t.hero.dashboard.months.apr, value: 91 },
 { month: t.hero.dashboard.months.may, value: 48 },
 { month: t.hero.dashboard.months.jun, value: 85 },
 ];

 const maxValue = Math.max(...chartData.map(d => d.value));

 // Detecta tema
 // Animação da receita
 useEffect(() => {
 const interval = setInterval(() => {
 setRevenue(prev => prev + Math.floor(Math.random() * 1000 - 500));
 }, 4000);

 return () => clearInterval(interval);
 }, []);

 return (
 <div className="w-full h-full flex gap-2 border transition-colors" style={{ borderRadius: '7px', borderColor: colors.borderLight }}>
 {/* Sidebar */}
 <div className="w-[60px] bg-gray-100 flex flex-col items-center py-4 gap-6 transition-colors" style={{ borderRadius: '7px' }}>
 <div className="w-8 h-8 flex items-center justify-center">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-700">
 <path d="M12 5c0 0-1.5-2-4-2S4 5 4 8s1.5 5 4 5 4-2 4-5zm0 0c0 0 1.5-2 4-2s4 2 4 5-1.5 5-4 5-4-2-4-5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 <path d="M12 5v14m-3 2l3-2 3 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 <circle cx="8" cy="7" r="1" fill="currentColor"/>
 <circle cx="16" cy="7" r="1" fill="currentColor"/>
 </svg>
 </div>
 
 <div className="flex flex-col gap-3 flex-1">
 <button 
 className={`w-10 h-10 flex items-center justify-center transition-all ${activeMetric === 'revenue' ? 'bg-gray-300' : 'hover:bg-gray-300/50'}`}
 style={{ borderRadius: '6px' }}
 onClick={() => setActiveMetric('revenue')}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={activeMetric === 'revenue' ? 'text-blue-500' : 'text-gray-400'}>
 <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>

 <button 
 className={`w-10 h-10 flex items-center justify-center transition-all ${activeMetric === 'users' ? 'bg-gray-300' : 'hover:bg-gray-300/50'}`}
 style={{ borderRadius: '6px' }}
 onClick={() => setActiveMetric('users')}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={activeMetric === 'users' ? 'text-blue-500' : 'text-gray-400'}>
 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>

 <button 
 className={`w-10 h-10 flex items-center justify-center transition-all ${activeMetric === 'growth' ? 'bg-gray-300' : 'hover:bg-gray-300/50'}`}
 style={{ borderRadius: '6px' }}
 onClick={() => setActiveMetric('growth')}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={activeMetric === 'growth' ? 'text-blue-500' : 'text-gray-400'}>
 <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 </div>

 <button className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 transition-all group" style={{ borderRadius: '6px' }}>
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500 group-hover:text-red-500 transition-colors">
 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 </div>

 {/* Main Content */}
 <div className="flex-1 flex flex-col gap-3">
 {/* Header */}
 <div className="bg-gray-100 p-4 transition-colors" style={{ borderRadius: '7px' }}>
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-sm font-semibold text-gray-900">{t.hero.dashboard.productTitle}</h3>
 <p className="text-xs text-gray-500">{t.hero.dashboard.productSubtitle}</p>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
 <span className="text-xs text-gray-600">{t.hero.dashboard.updated}</span>
 </div>
 </div>

 {/* Metrics Cards */}
 <div className="grid grid-cols-2 gap-3">
 <div 
 className="bg-white p-3 transition-all cursor-pointer hover:scale-[1.02]"
 style={{ borderRadius: '7px' }}
 onMouseEnter={() => setIsHovering(true)}
 onMouseLeave={() => setIsHovering(false)}
 >
 <div className="text-xs text-gray-500 mb-1">{t.hero.dashboard.totalRevenue}</div>
 <div className="text-xl font-bold text-gray-900">
 R$ {(revenue / 1000).toFixed(1)}k
 </div>
 <div className="flex items-center gap-1 mt-1">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500">
 <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="17 6 23 6 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <span className="text-xs text-green-600 font-medium">+12.5%</span>
 </div>
 </div>

 <div className="bg-white p-3 transition-colors" style={{ borderRadius: '7px' }}>
 <div className="text-xs text-gray-500 mb-1">{t.hero.dashboard.activeClients}</div>
 <div className="text-xl font-bold text-gray-900">1,247</div>
 <div className="flex items-center gap-1 mt-1">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500">
 <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="17 6 23 6 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <span className="text-xs text-green-600 font-medium">+8.2%</span>
 </div>
 </div>
 </div>
 </div>

 {/* Chart */}
 <div className="flex-1 bg-gray-100 p-4 transition-colors" style={{ borderRadius: '7px' }}>
 <div className="flex items-center justify-between mb-4">
 <div className="text-xs font-medium text-gray-600">{t.hero.dashboard.monthlyRevenue}</div>
 <div className="text-xs text-gray-500">2025</div>
 </div>
 
 {/* Bar Chart */}
 <div className="flex items-end justify-between gap-2" style={{ height: '300px' }}>
 {chartData.map((data, index) => (
 <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
 <div 
 className="w-full bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 relative"
 style={{ 
 height: `${(data.value / maxValue) * 100}%`,
 borderRadius: '4px 4px 0 0',
 minHeight: '20px',
 }}
 >
 {/* Tooltip */}
 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600 text-white px-2 py-1 text-xs whitespace-nowrap" style={{ borderRadius: '4px' }}>
 R$ {data.value}k
 </div>
 </div>
 <span className="text-xs text-gray-500">{data.month}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Footer Stats */}
 <div className="bg-gray-100 p-3 flex items-center justify-between transition-colors" style={{ borderRadius: '7px' }}>
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-green-500/10 flex items-center justify-center" style={{ borderRadius: '6px' }}>
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500">
 <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 <div>
 <div className="text-xs text-gray-900 font-medium">{t.hero.dashboard.roi}: 94.2%</div>
 <div className="text-xs text-gray-500">{t.hero.dashboard.thisMonth}</div>
 </div>
 </div>
 <div className="text-xs text-gray-400">{t.hero.dashboard.last30Days}</div>
 </div>
 </div>
 </div>
 );
};

export default InteractiveDashboard;

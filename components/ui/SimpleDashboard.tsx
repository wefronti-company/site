import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';

/**
 * Dashboard simplificado para mobile
 * Versão leve sem animações pesadas
 */
const SimpleDashboard: React.FC = () => {

 const stats = [
 { label: 'Receita Total', value: 'R$ 247K', trend: '+12%' },
 { label: 'Clientes Ativos', value: '3.2K', trend: '+8%' },
 { label: 'ROI', value: '24%', trend: '+5%' },
 ];

 return (
 <div 
 className="w-full h-full p-6 border transition-colors bg-white/50 backdrop-blur-sm"
 style={{ 
 borderRadius: '7px', 
 borderColor: colors.borderLight 
 }}
 >
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-semibold text-gray-900">
 Seu produto
 </h3>
 <div className="flex gap-1">
 <div className="w-2 h-2 rounded-full bg-green-500" />
 <div className="w-2 h-2 rounded-full bg-blue-500" />
 <div className="w-2 h-2 rounded-full bg-purple-500" />
 </div>
 </div>

 {/* Stats Grid */}
 <div className="grid gap-4">
 {stats.map((stat, i) => (
 <div 
 key={i}
 className="p-4 rounded-lg border transition-colors"
 style={{ borderColor: colors.borderLight }}
 >
 <div className="text-sm text-gray-600 mb-1">
 {stat.label}
 </div>
 <div className="flex items-end justify-between">
 <div className="text-2xl font-bold text-gray-900">
 {stat.value}
 </div>
 <div className="text-sm font-medium text-green-500">
 {stat.trend}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Simple Chart */}
 <div className="mt-6 h-24 flex items-end gap-2">
 {[65, 45, 80, 55, 90, 70].map((height, i) => (
 <div 
 key={i}
 className="flex-1 bg-blue-500/20 rounded-t transition-all duration-300 hover:bg-blue-500/40"
 style={{ height: `${height}%` }}
 />
 ))}
 </div>
 </div>
 );
};

export default SimpleDashboard;

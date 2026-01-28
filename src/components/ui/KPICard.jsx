import React from 'react';

const colorSchemes = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'bg-blue-500/20 text-blue-400', value: 'text-blue-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'bg-green-500/20 text-green-400', value: 'text-green-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'bg-purple-500/20 text-purple-400', value: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'bg-cyan-500/20 text-cyan-400', value: 'text-cyan-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'bg-yellow-500/20 text-yellow-400', value: 'text-yellow-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'bg-red-500/20 text-red-400', value: 'text-red-400' },
};

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  trend,
  trendValue 
}) => {
  const scheme = colorSchemes[color];

  return (
    <div className={`${scheme.bg} border ${scheme.border} rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${scheme.icon} flex items-center justify-center`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${scheme.value}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default KPICard;

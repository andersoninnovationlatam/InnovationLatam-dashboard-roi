import React from 'react';

export const Card = ({ children, className = '', hover = false, onClick }) => (
  <div 
    className={`bg-slate-800/50 border border-slate-700 rounded-2xl ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, icon: Icon, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white flex items-center gap-2 ${className}`}>
    {Icon && <Icon className="w-5 h-5 text-blue-400" />}
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`}>
    {children}
  </p>
);

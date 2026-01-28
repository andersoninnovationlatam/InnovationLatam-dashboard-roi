import React from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 shadow-lg shadow-blue-500/25',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600',
  outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  ghost: 'text-slate-400 hover:text-white hover:bg-slate-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5 text-lg',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  iconPosition = 'left'
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
  >
    {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
    {children}
    {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
  </button>
);

export default Button;

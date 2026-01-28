import React from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  hint,
  icon: Icon,
  className = '',
  ...props 
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {Icon && <Icon className="inline w-4 h-4 mr-2 text-blue-400" />}
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`
        w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white 
        placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${error ? 'border-red-500' : 'border-slate-600'}
      `}
      {...props}
    />
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export const Select = ({ 
  label, 
  id, 
  value, 
  onChange, 
  options = [], 
  required = false,
  hint,
  icon: Icon,
  className = '' 
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {Icon && <Icon className="inline w-4 h-4 mr-2 text-cyan-400" />}
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
    )}
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
  </div>
);

export const Textarea = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  className = '' 
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
    )}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>
);

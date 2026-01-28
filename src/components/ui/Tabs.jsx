import React from 'react';

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-0 bg-slate-800/50 rounded-2xl p-1.5 border border-slate-700 ${className}`}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id || index}
          type="button"
          onClick={() => onChange(index)}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
            ${activeTab === index 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'}
          `}
        >
          <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs">
            {index + 1}
          </span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export const TabPanel = ({ children, active }) => {
  if (!active) return null;
  return <div className="animate-fade-in">{children}</div>;
};

export default Tabs;

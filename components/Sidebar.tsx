
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isPremium: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose, onLogout, isPremium }) => {
  const menuItems = [
    { view: AppView.LANDING, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { view: AppView.IDENTIFY, label: 'Identify Plant', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
    { view: AppView.LIGHT_METER, label: 'Light Meter', icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1m14.071 7.071l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
    { view: AppView.GARDEN, label: 'My Garden', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z', isPro: true },
    { view: AppView.REMINDERS, label: 'Care Tasks', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', isPro: true },
    { view: AppView.DIAGNOSE, label: 'Health Diagnosis', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', isPro: true },
    { view: AppView.MAP, label: 'Garden Centers', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', isPro: true },
    { view: AppView.UPGRADE, label: 'Pro Upgrade', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-botanist rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-botanist/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21a9.003 9.003 0 008.354-5.646z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-800">FloraGenius</span>
          </div>

          <nav className="space-y-3 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { onNavigate(item.view); onClose(); }}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-full transition-all duration-300 ${currentView === item.view ? 'bg-botanist text-white shadow-xl shadow-botanist/25 font-bold scale-[1.02]' : 'hover:bg-botanist/10 text-slate-500 hover:text-botanist font-semibold'}`}
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className="text-[15px]">{item.label}</span>
                </div>
                {item.isPro && !isPremium && (
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border tracking-[0.1em] shadow-sm transition-all flex items-center ${
                    currentView === item.view 
                      ? 'bg-white text-botanist border-white/50' 
                      : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 border-amber-200/50 shadow-amber-500/20'
                  }`}>
                    <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    PRO
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-50">
            {isPremium && (
              <div className="mb-6 p-5 bg-botanist/5 rounded-[2rem] border border-botanist/10 flex items-center space-x-4">
                <div className="p-2.5 bg-botanist/20 rounded-xl text-botanist">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                <span className="text-sm text-botanist-dark font-extrabold uppercase tracking-widest">Pro Tier</span>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

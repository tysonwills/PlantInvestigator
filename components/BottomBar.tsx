
import React from 'react';
import { AppView } from '../types';

interface BottomBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isPremium: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({ currentView, onNavigate, isPremium }) => {
  const navItems = [
    { 
      view: AppView.GARDEN, 
      label: 'Garden', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z', 
      isPro: true 
    },
    { 
      view: AppView.REMINDERS, 
      label: 'Care', 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
      isPro: true 
    },
    { 
      view: AppView.DIAGNOSE, 
      label: 'Doctor', 
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
      isPro: true 
    },
    { 
      view: AppView.LIGHT_METER, 
      label: 'Meter', 
      icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1m14.071 7.071l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40 lg:hidden pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        {/* Main Bar */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-20 flex items-center justify-between px-8">
          
          {/* Left Nav Group */}
          <div className="flex items-center space-x-6">
            {navItems.slice(0, 2).map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === item.view ? 'text-botanist scale-110' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                  </svg>
                  {item.isPro && !isPremium && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Spacer for Floating Button */}
          <div className="w-16"></div>

          {/* Right Nav Group */}
          <div className="flex items-center space-x-6">
            {navItems.slice(2, 4).map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === item.view ? 'text-botanist scale-110' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                  </svg>
                  {item.isPro && !isPremium && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Signature Floating Center Button */}
        <button
          onClick={() => onNavigate(AppView.IDENTIFY)}
          className={`absolute left-1/2 -translate-x-1/2 -top-6 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,208,156,0.4)] transition-all duration-500 active:scale-90 active:shadow-inner group ${currentView === AppView.IDENTIFY ? 'bg-white text-botanist' : 'bg-botanist text-white'}`}
        >
          <div className="relative">
            <svg className="w-10 h-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className={`absolute -inset-2 bg-current rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default BottomBar;


import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  title: AppView;
  onToggleSidebar: () => void;
  isAuthenticated: boolean;
  onNavigate: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar, isAuthenticated, onNavigate }) => {
  const getDisplayTitle = () => {
    switch (title) {
      case AppView.LANDING: return 'Home';
      case AppView.IDENTIFY: return 'Plant Identification';
      case AppView.DIAGNOSE: return 'Plant Doctor';
      case AppView.GARDEN: return 'My Garden';
      case AppView.UPGRADE: return 'Go Premium';
      case AppView.AUTH: return 'Welcome';
      case AppView.REMINDERS: return 'Care Schedule';
      default: return 'FloraGenius';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 heading-font">{getDisplayTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        {isAuthenticated && (
          <button 
            onClick={() => onNavigate(AppView.GARDEN)}
            className={`hidden md:flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${title === AppView.GARDEN ? 'bg-botanist text-white shadow-lg shadow-botanist/20' : 'text-slate-500 hover:bg-slate-50 hover:text-botanist'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z" />
            </svg>
            <span>My Garden</span>
          </button>
        )}
        
        <div className="flex items-center space-x-2 text-emerald-600">
          <span className="hidden md:inline-block text-sm font-medium">Auto-sync Active</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;

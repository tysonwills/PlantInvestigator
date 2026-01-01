
import React from 'react';
import { User, PlantDetails, Reminder, AppView } from '../types';

interface AccountViewProps {
  user: User;
  gardenCount: number;
  reminderCount: number;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ user, gardenCount, reminderCount, onLogout, onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Profile Header Decoration */}
        <div className="h-40 bg-gradient-to-br from-botanist to-emerald-700 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        </div>

        {/* Profile Avatar */}
        <div className="relative -mt-16 px-10 flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl relative z-10">
            <div className="w-full h-full bg-botanist rounded-[2rem] flex items-center justify-center text-white">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {user.isPremium && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-300 to-amber-500 w-10 h-10 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user.email.split('@')[0]}</h2>
            <p className="text-slate-400 font-bold text-lg mt-1">{user.email}</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100/50 text-center group hover:bg-botanist/5 transition-colors">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Garden Sanctuary</p>
              <p className="text-3xl font-black text-slate-800">{gardenCount}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Saved Species</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100/50 text-center group hover:bg-botanist/5 transition-colors">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Active Care</p>
              <p className="text-3xl font-black text-slate-800">{reminderCount}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Pending Tasks</p>
            </div>
          </div>

          {/* Membership Info */}
          <div className={`p-8 rounded-[3rem] border-2 transition-all ${user.isPremium ? 'border-botanist bg-botanist/5 shadow-inner' : 'border-slate-100 bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {user.isPremium ? 'FloraGenius Pro' : 'Standard Identity'}
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  {user.isPremium ? 'Active subscription since 2024' : 'Unlock elite botanical intelligence tools'}
                </p>
              </div>
              {!user.isPremium && (
                <button 
                  onClick={() => onNavigate(AppView.UPGRADE)}
                  className="bg-botanist text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-botanist/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Upgrade
                </button>
              )}
              {user.isPremium && (
                <div className="w-12 h-12 bg-botanist rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(AppView.GARDEN)}
              className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-5 rounded-full hover:bg-slate-50 transition-all active:scale-95 text-sm uppercase tracking-[0.2em]"
            >
              View Garden
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 bg-red-50 text-red-600 font-black py-5 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-95 text-sm uppercase tracking-[0.2em] shadow-sm shadow-red-200"
            >
              Logout Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountView;

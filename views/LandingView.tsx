
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getDailyPlantTip } from '../geminiService';

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
  isPremium: boolean;
}

const LandingView: React.FC<LandingViewProps> = ({ onNavigate, isPremium }) => {
  const [dailyTip, setDailyTip] = useState<{ title: string; tip: string } | null>(null);
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    async function fetchTip() {
      try {
        const tip = await getDailyPlantTip();
        setDailyTip(tip);
      } catch (error) {
        console.error("Failed to fetch tip:", error);
      } finally {
        setTipLoading(false);
      }
    }
    fetchTip();
  }, []);

  const sections = [
    {
      view: AppView.IDENTIFY,
      title: 'Identify Plant',
      desc: 'Instant recognition of flowers, trees, and succulents.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-botanist',
      lightColor: 'bg-botanist-light',
      textColor: 'text-white'
    },
    {
      view: AppView.REMINDERS,
      title: 'Care Tasks',
      desc: 'Smart schedules for watering and plant health.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-white'
    },
    {
      view: AppView.DIAGNOSE,
      title: 'Plant Doctor',
      desc: 'Diagnose diseases and pests with organic remedies.',
      isPro: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-white'
    },
    {
      view: AppView.MAP,
      title: 'Garden Centers',
      desc: 'Find nurseries and garden centers near you.',
      isPro: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden bg-botanist rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl shadow-botanist/20 group">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white">
            Hello, Gardener!
          </h2>
          <p className="text-white/90 text-xl md:text-2xl mb-10 font-medium leading-relaxed opacity-95">
            Everything you need to keep your urban oasis flourishing is right here at your fingertips.
          </p>
          <div className="flex items-center space-x-3 text-sm bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full w-fit border border-white/20">
            <span className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(110,231,183,1)]"></span>
            <span className="font-extrabold uppercase tracking-widest text-[11px]">AI Hub Active</span>
          </div>
        </div>

        {/* Decorative Vibrant Plant Placeholder */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full hidden lg:block select-none pointer-events-none transition-transform duration-700 group-hover:scale-105">
           <img 
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop" 
            alt="Vibrant Plant" 
            className="w-full h-full object-contain object-right opacity-80 mix-blend-lighten"
           />
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-botanist-light/10 rounded-full -mr-20 -mb-20 blur-[100px]"></div>
      </section>

      {/* Daily Tip Section */}
      <section className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 flex-shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            {tipLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              </div>
            ) : dailyTip ? (
              <>
                <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] mb-3">Plant Care Tip of the Day</h4>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{dailyTip.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{dailyTip.tip}</p>
              </>
            ) : (
              <p className="text-slate-400 font-bold italic">Checking our botanical library for wisdom...</p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-100 transition-colors"></div>
      </section>

      {/* Main Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((section, idx) => {
          const isLocked = section.isPro && !isPremium;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(section.view)}
              className={`group relative bg-white p-10 rounded-[3rem] shadow-sm border transition-all duration-500 text-left flex flex-col items-start overflow-hidden
                ${isLocked ? 'border-slate-100 opacity-90' : 'border-slate-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-3'}`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transition-all duration-500 relative
                ${isLocked ? 'bg-slate-200 text-slate-400 grayscale' : `${section.color} ${section.textColor} group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}`}>
                {section.icon}
                {isLocked && (
                  <div className="absolute -top-3 -right-3 bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-white tracking-tighter flex items-center">
                    <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    PRO
                  </div>
                )}
              </div>
              <h3 className={`text-2xl font-extrabold mb-3 transition-colors tracking-tight
                ${isLocked ? 'text-slate-400' : 'text-slate-800 group-hover:text-botanist'}`}>
                {section.title}
              </h3>
              <p className={`text-[15px] leading-relaxed font-medium ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                {section.desc}
              </p>
              
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${section.lightColor} rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 blur-2xl`}></div>
              
              <div className={`mt-8 flex items-center text-xs font-black uppercase tracking-[0.25em] transition-all transform
                ${isLocked ? 'text-amber-500 opacity-100 translate-x-0' : 'text-botanist opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0'}`}>
                {isLocked ? 'Unlock Pro' : 'Explore'}
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats/Showcase Bar */}
      <section className="relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 flex flex-wrap items-center justify-around gap-12 shadow-sm">
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-14 h-14 bg-botanist/10 rounded-full flex items-center justify-center text-botanist">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Catalog</p>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight">12,000+ Species</p>
          </div>
        </div>
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Validation</p>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight">98.4% Accuracy</p>
          </div>
        </div>
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 00-1.6 0l-8.613 10.165a1 1 0 00.73 1.622h3.303l-2.026 5.312a1 1 0 001.616 1.054l10.888-10.235a1 1 0 00-.666-1.707H11.5l1.9-5.122a1 1 0 00-1.1-.96z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Response</p>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight">Real-time AI</p>
          </div>
        </div>

        {/* Subtle decorative plant accent */}
        <div className="absolute left-0 bottom-0 w-32 h-32 opacity-10 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1520302630591-fd1c66ed11ef?q=80&w=400&auto=format&fit=crop" 
            alt="Leaf accent" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default LandingView;

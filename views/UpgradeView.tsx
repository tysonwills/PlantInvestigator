
import React from 'react';

interface UpgradeViewProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ isPremium, onUpgrade }) => {
  const features = [
    { title: "Pro Diagnostics", desc: "Advanced AI health analysis", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { title: "Smart Care Engine", desc: "Automated watering schedules", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Garden Sanctuary", desc: "Unlimited plant collection slots", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z" },
    { title: "Ad-Free", desc: "Focused botanical experience", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-botanist to-emerald-700 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-botanist/30 mb-8">
        {/* Subtle Geometric Accents instead of image */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Premium Access</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Elevate Your <br className="hidden md:block" /> Garden Game
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl max-w-lg font-medium leading-relaxed mb-0">
            Join the elite circle of urban gardeners with our pro-grade AI tools and management suite.
          </p>
        </div>
      </div>

      {/* Pricing Card - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Features Column */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start space-x-4 hover:border-botanist/30 transition-colors group">
              <div className="w-12 h-12 bg-botanist/10 rounded-2xl flex items-center justify-center text-botanist flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={feature.icon} />
                </svg>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-1">{feature.title}</h4>
                <p className="text-slate-500 text-xs font-medium leading-tight">{feature.desc}</p>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 bg-slate-50 p-6 rounded-[2rem] border border-slate-200/50">
             <div className="flex items-center space-x-3 text-slate-400">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               <span className="text-[11px] font-black uppercase tracking-widest">Plus all standard features included</span>
             </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white p-8 rounded-[3rem] border-2 border-botanist shadow-xl shadow-botanist/10 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-botanist text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Best Value</span>
          </div>

          <div className="mb-8">
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Monthly Plan</p>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">$9.99</span>
              <span className="text-slate-400 font-bold text-sm ml-1">/mo</span>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className={`w-full py-5 px-8 rounded-full font-black text-lg transition-all shadow-xl active:scale-95 mb-6 ${isPremium ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-botanist text-white hover:bg-botanist-dark hover:shadow-botanist/30'}`}
          >
            {isPremium ? 'Cancel Subscription' : 'Upgrade to Pro'}
          </button>

          <div className="space-y-3 w-full">
            <div className="flex items-center justify-center space-x-2 text-slate-500 text-[11px] font-bold">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>Secure Checkout</span>
            </div>
            <p className="text-slate-400 text-[10px] font-medium px-4">14-day free trial for new users. Cancel anytime within settings.</p>
          </div>

          {/* Background flourish */}
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-botanist/5 rounded-full blur-2xl group-hover:bg-botanist/10 transition-colors"></div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;


import React from 'react';

interface UpgradeViewProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ isPremium, onUpgrade }) => {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="bg-botanist rounded-[4.5rem] p-12 md:p-24 text-white relative overflow-hidden text-center shadow-[0_50px_100px_-20px_rgba(0,208,156,0.3)]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1600&auto=format&fit=crop" 
            alt="Premium Background" 
            className="w-full h-full object-cover grayscale brightness-150"
          />
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-white/20 backdrop-blur-xl px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-12 border border-white/20">
            Unleash Full Botanical Potential
          </div>
          <h2 className="text-6xl md:text-8xl font-extrabold mb-10 tracking-tighter">FloraGenius Pro</h2>
          <p className="text-white/90 text-xl md:text-3xl mb-20 max-w-3xl mx-auto font-medium leading-relaxed opacity-95">Expert-grade analysis and unlimited care tools for the modern urban gardener.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 text-left max-w-4xl mx-auto">
            {[
              "Unlimited Pro Plant Diagnosis",
              "24/7 Priority Specialist Access",
              "Detailed Soil & Nutrient Reports",
              "Smart Care Reminder Engine",
              "Offline Reference Library",
              "Pure Ad-Free Environment"
            ].map(feature => (
              <div key={feature} className="flex items-center space-x-5 bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                <div className="bg-white rounded-full p-2 shadow-2xl flex-shrink-0">
                  <svg className="w-5 h-5 text-botanist" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3.5rem] p-14 inline-block min-w-[380px] shadow-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem] duration-1000"></div>
            <div className="mb-10 flex flex-col relative z-10">
              <span className="text-7xl font-black tracking-tighter">$9.99</span>
              <span className="text-white/70 font-black uppercase tracking-[0.4em] text-[12px] mt-4">Per Month</span>
            </div>
            <button 
              onClick={onUpgrade}
              className={`w-full py-6 px-12 rounded-full font-black text-xl transition-all shadow-2xl active:scale-95 relative z-10 ${isPremium ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-botanist hover:bg-slate-50 hover:scale-[1.03] hover:shadow-white/20'}`}
            >
              {isPremium ? 'Cancel Pro Access' : 'Go Pro Unlimited'}
            </button>
            {!isPremium && <p className="mt-8 text-sm text-white/70 font-bold italic tracking-wide">Start 14-day free trial. Anytime cancellation.</p>}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-80 -mt-80"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[140px] -ml-80 -mb-80"></div>
      </div>
    </div>
  );
};

export default UpgradeView;


import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import { identifyPlant, getPlantDetailsByName } from '../geminiService';
import { PlantDetails, AppView } from '../types';

interface IdentificationViewProps {
  initialPlant?: PlantDetails;
  onResult: (data: PlantDetails, imageUrl: string) => void;
  onAddReminder: (plantName: string, careDetails: string) => void;
  onNavigate: (view: AppView) => void;
}

const VIBRANT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1463320326303-11dad8c3008a?q=80&w=800&auto=format&fit=crop"
];

const AccordionItem: React.FC<{
  title: string;
  icon: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  colorClass: string;
  bgClass: string;
  badge?: { text: string; color: string; bg: string };
}> = ({ title, icon, content, isOpen, onToggle, colorClass, bgClass, badge }) => {
  return (
    <div className="border-b border-slate-100 last:border-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-5">
          <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center ${colorClass} shadow-inner group-hover:scale-110 transition-transform`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</span>
            {badge && (
              <span className={`mt-1 inline-block w-fit px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${badge.bg} ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 ml-16 text-slate-600 font-semibold leading-relaxed text-[15px]">
          {content}
        </div>
      </div>
    </div>
  );
};

const IdentificationView: React.FC<IdentificationViewProps> = ({ initialPlant, onResult, onAddReminder, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState<string | null>(null);
  const [result, setResult] = useState<PlantDetails | null>(initialPlant || null);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialPlant?.imageUrl || null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [imageError, setImageError] = useState(false);

  const handleCapture = async (base64: string) => {
    setLoading(true);
    setImageError(false);
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    setCapturedImage(dataUrl);
    try {
      const data = await identifyPlant(base64);
      setResult(data);
      onResult(data, dataUrl);
    } catch (error) {
      console.error("Identification failed", error);
      alert("Failed to identify plant. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareRelative = async (plantName: string) => {
    setCompareLoading(plantName);
    setImageError(false);
    try {
      const data = await getPlantDetailsByName(plantName);
      setResult(data);
      setOpenIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Comparison failed", error);
    } finally {
      setCompareLoading(null);
    }
  };

  const getPlaceholder = (seed: string) => {
    const s = seed.toLowerCase();
    const hash = s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return VIBRANT_PLACEHOLDERS[hash % VIBRANT_PLACEHOLDERS.length];
  };

  if (result) {
    const referenceImageUrl = imageError ? getPlaceholder(result.name) : (result.imageUrl || getPlaceholder(result.name));
    
    const careItems = [
      { label: 'Hydration', value: result.careGuide.watering, icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7', color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: 'Sunlight', value: result.careGuide.light, icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1', color: 'text-amber-500', bg: 'bg-amber-50' },
      { label: 'Substrate', value: result.careGuide.soil, icon: 'M3.055 11H5a2 2 0 012 2v1', color: 'text-amber-700', bg: 'bg-amber-50' },
      { 
        label: 'RHS Care Remedies', 
        value: (
          <div className="space-y-3 mt-2">
            {result.careGuide.homeRemedies.map((remedy, idx) => (
              <div key={idx} className="flex items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-botanist mr-4 flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p className="text-sm text-slate-700 font-bold">{remedy}</p>
              </div>
            ))}
          </div>
        ), 
        icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-botanist', bg: 'bg-botanist/10' 
      }
    ];

    const confidencePercent = Math.round((result.confidence || 0) * 100);

    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        <button 
          onClick={() => { 
            if (initialPlant) onNavigate(AppView.GARDEN);
            else { setResult(null); setCapturedImage(null); }
          }}
          className="group flex items-center space-x-3 text-botanist font-extrabold px-6 py-3 rounded-full hover:bg-botanist/5 transition-all w-fit"
        >
          <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-[15px]">{initialPlant ? 'Back to Garden' : 'New Identification'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-50 h-[500px]">
              <img 
                src={referenceImageUrl} 
                alt="Official Record" 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {result.hasAgm && (
                <div className="absolute top-8 right-8 bg-amber-400 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border-2 border-white animate-bounce-subtle">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span className="font-black text-xs uppercase tracking-widest">RHS Award of Garden Merit</span>
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-botanist/5 rounded-full -mr-8 -mt-8"></div>
               <p className="text-slate-600 font-semibold leading-relaxed text-lg mb-6">{result.description}</p>
               
               {/* Visual Confidence Meter */}
               <div className="pt-6 border-t border-slate-100">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Identification Confidence</span>
                   <span className={`text-sm font-black ${confidencePercent > 80 ? 'text-botanist' : 'text-amber-500'}`}>{confidencePercent}%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${confidencePercent > 80 ? 'bg-botanist' : 'bg-amber-500'}`}
                    style={{ width: `${confidencePercent}%` }}
                   ></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm">
              <div className="mb-8">
                <p className="text-botanist font-black uppercase tracking-[0.4em] text-[11px] mb-4">Official RHS Monograph</p>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-3">{result.name}</h1>
                <p className="text-2xl italic text-botanist-dark font-extrabold opacity-70 mb-8">{result.botanicalName}</p>
                
                <div className="flex flex-wrap gap-3">
                  <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-slate-100">{result.family}</span>
                  {result.isToxic && <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">Toxic</span>}
                </div>
              </div>
              <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                {careItems.map((item, idx) => (
                  <AccordionItem key={idx} title={item.label} icon={item.icon} content={item.value} isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} colorClass={item.color} bgClass={item.bg} />
                ))}
              </div>
              <button 
                onClick={() => onResult(result, capturedImage || result.imageUrl || "")}
                className="w-full mt-10 bg-botanist text-white font-black py-5 rounded-full shadow-xl shadow-botanist/20 hover:bg-botanist-dark transition-all"
              >
                Save to My Garden
              </button>
            </div>
          </div>
        </div>

        {/* Similar Looking Plants & Care Suggestions */}
        {result.similarPlants && result.similarPlants.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-1.5 h-10 bg-botanist rounded-full"></div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">RHS Recommendations</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Plants with similar care needs or appearance</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {result.similarPlants.map((plant, idx) => (
                <div key={idx} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col">
                  {compareLoading === plant.name && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                      <div className="w-8 h-8 border-[3px] border-botanist border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={plant.imageUrl || getPlaceholder(plant.name)} 
                      alt={plant.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholder(plant.name); }}
                    />
                    {plant.careMatch && (
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-botanist shadow-sm">
                        Perfect Care Match
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-2xl font-extrabold text-slate-800 mb-4">{plant.name}</h4>
                    <p className="text-slate-500 font-semibold leading-relaxed mb-8 text-[15px] flex-1 line-clamp-4">{plant.reason}</p>
                    <button onClick={() => handleCompareRelative(plant.name)} className="text-botanist font-black text-xs uppercase tracking-[0.2em] flex items-center group-hover:translate-x-2 transition-transform">
                      Explore Monograph
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">RHS Botanical ID</h2>
        <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto opacity-80">RHS-standard identification via advanced AI. Powered by the official Royal Horticultural Society database.</p>
      </div>
      <div className="shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[4rem]">
        <CameraCapture onCapture={handleCapture} isLoading={loading} label="Snap Specimen" />
      </div>
    </div>
  );
};

export default IdentificationView;

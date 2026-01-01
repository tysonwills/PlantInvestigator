import React, { useState, useRef, useEffect } from 'react';
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
  "https://images.unsplash.com/photo-1463320326303-11dad8c3008a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1416870230247-3b461463779e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501004318641-729e8e3986eff?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525498122316-396d85993e98?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470058869958-2a77a67c023d?q=80&w=800&auto=format&fit=crop"
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
              <span className={`mt-1 inline-block w-fit px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${badge.bg} ${badge.color}`}>
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
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
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

  const handleCapture = async (base64: string) => {
    setLoading(true);
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

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
      title: `Check out this ${result.name}!`,
      text: `I just discovered a ${result.name} (${result.botanicalName}) using FloraGenius. It prefers ${result.careGuide.light.toLowerCase()} and ${result.careGuide.watering.toLowerCase()}!`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title} ${shareData.text}`);
        alert('Plant details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleCompareRelative = async (plantName: string) => {
    setCompareLoading(plantName);
    try {
      const data = await getPlantDetailsByName(plantName);
      setResult(data);
      setOpenIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Comparison failed", error);
      alert("Could not fetch relative data.");
    } finally {
      setCompareLoading(null);
    }
  };

  const getBadge = (text: string, type: 'light' | 'water' | 'soil') => {
    const t = text.toLowerCase();
    if (type === 'light') {
      if (t.includes('bright') || t.includes('direct') || t.includes('full sun')) return { text: 'High Light', color: 'text-amber-700', bg: 'bg-amber-100', icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1' };
      if (t.includes('partial') || t.includes('indirect')) return { text: 'Partial Light', color: 'text-orange-700', bg: 'bg-orange-100', icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1' };
      if (t.includes('low') || t.includes('shade')) return { text: 'Low Light', color: 'text-slate-700', bg: 'bg-slate-200', icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1' };
    }
    if (type === 'water') {
      if (t.includes('frequent') || t.includes('moist') || t.includes('regularly')) return { text: 'High Water', color: 'text-blue-700', bg: 'bg-blue-100', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7' };
      if (t.includes('moderate') || t.includes('week')) return { text: 'Moderate Water', color: 'text-cyan-700', bg: 'bg-cyan-100', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7' };
      if (t.includes('allow to dry') || t.includes('infrequent') || t.includes('low')) return { text: 'Low Water', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7' };
    }
    if (type === 'soil') {
      if (t.includes('well-drained') || t.includes('drainage')) return { text: 'Optimal Drainage', color: 'text-amber-900', bg: 'bg-amber-100', icon: 'M3.055 11H5a2 2 0 012 2v1' };
      if (t.includes('rich') || t.includes('compost')) return { text: 'High Nutrient', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: 'M3.055 11H5a2 2 0 012 2v1' };
    }
    return undefined;
  };

  const getRemedyIcon = (remedy: string) => {
    const r = remedy.toLowerCase();
    if (r.includes('soap') || r.includes('dish') || r.includes('detergent')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v3a3 3 0 01-3 3z" /></svg>,
        color: 'text-cyan-500'
      };
    }
    if (r.includes('oil') || r.includes('neem')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.586.344l-2.096-.419a1 1 0 01-.801-1.223l.112-.556a3 3 0 01.18-.545l.135-.303a1 1 0 00-.13-.984l-1.033-1.378a1 1 0 00-1.428-.182l-.444.333a1 1 0 01-1.385-.183A5 5 0 017 4.5V4" /></svg>,
        color: 'text-emerald-600'
      };
    }
    if (r.includes('water') || r.includes('mist') || r.includes('spray')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        color: 'text-blue-500'
      };
    }
    if (r.includes('cinnamon') || r.includes('spice')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9.003 9.003 0 008.354-5.646z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21" /></svg>,
        color: 'text-orange-800'
      };
    }
    if (r.includes('garlic') || r.includes('pepper') || r.includes('capsaicin')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>,
        color: 'text-red-600'
      };
    }
    if (r.includes('vinegar') || r.includes('acetic')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.586.344" /></svg>,
        color: 'text-amber-600'
      };
    }
    if (r.includes('soda') || r.includes('milk') || r.includes('baking')) {
      return { 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
        color: 'text-slate-500'
      };
    }
    return { 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>,
      color: 'text-botanist'
    };
  };

  const getPlaceholder = (seed: string) => {
    const s = seed.toLowerCase();
    const hash = s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return VIBRANT_PLACEHOLDERS[hash % VIBRANT_PLACEHOLDERS.length];
  };

  if (result) {
    const referenceImageUrl = result.imageUrl || getPlaceholder(result.name);
    
    const careItems = [
      { label: 'Hydration', value: result.careGuide.watering, icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7', color: 'text-blue-500', bg: 'bg-blue-50', badge: getBadge(result.careGuide.watering, 'water') },
      { label: 'Luminosity', value: result.careGuide.light, icon: 'M12 3v1m0 16v1m9-9h-1M4 9h-1', color: 'text-amber-500', bg: 'bg-amber-50', badge: getBadge(result.careGuide.light, 'light') },
      { label: 'Substrate', value: result.careGuide.soil, icon: 'M3.055 11H5a2 2 0 012 2v1', color: 'text-amber-700', bg: 'bg-amber-50', badge: getBadge(result.careGuide.soil, 'soil') },
      { label: 'Climate', value: result.careGuide.humidity, icon: 'M12 2.25c-5.385 0-9.75 4.365', color: 'text-cyan-600', bg: 'bg-cyan-50' },
      { label: 'Fertilization', value: result.careGuide.fertilizer, icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { 
        label: 'Home Remedies', 
        value: (
          <div className="space-y-4 mt-2">
            {result.careGuide.homeRemedies.map((remedy, idx) => {
              const remedyStyle = getRemedyIcon(remedy);
              return (
                <div key={idx} className="flex items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-botanist/5 transition-colors group">
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center ${remedyStyle.color} shadow-sm mr-4 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {remedyStyle.icon}
                  </div>
                  <div className="pt-1"><p className="text-sm text-slate-700 font-bold leading-relaxed">{remedy}</p></div>
                </div>
              );
            })}
          </div>
        ), 
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.586.344l-2.096-.419a1 1 0 01-.801-1.223', color: 'text-botanist', bg: 'bg-botanist/10' 
      }
    ];

    // Build summary conditions bar
    const summaryChips = [
      { key: 'light', value: result.careGuide.light, type: 'light' as const },
      { key: 'water', value: result.careGuide.watering, type: 'water' as const },
      { key: 'soil', value: result.careGuide.soil, type: 'soil' as const }
    ].map(item => ({ ...item, badge: getBadge(item.value, item.type) }));

    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => { 
              if (initialPlant) {
                onNavigate(AppView.GARDEN);
              } else {
                setResult(null); 
                setCapturedImage(null); 
              }
            }}
            className="group flex items-center space-x-3 text-botanist hover:text-botanist-dark font-extrabold px-6 py-3 rounded-full hover:bg-botanist/5 transition-all w-fit"
          >
            <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-[15px]">{initialPlant ? 'Back to Garden' : 'Back to Scanner'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-50 h-[500px]">
              <img src={referenceImageUrl} alt="Botanical Record" className="w-full h-full object-cover select-none" />
              
              <div className="absolute top-6 left-6 flex flex-col space-y-3">
                 <div className="bg-botanist/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-white/20">
                    Botanical Reference
                 </div>
                 <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-slate-200">
                    Expert Record
                 </div>
                 {result.isToxic && <div className="bg-red-500/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-white/20">Toxic to Pets</div>}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Expert Description</h4>
               <p className="text-slate-600 font-semibold leading-relaxed text-lg">{result.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm">
              <div className="mb-8">
                <p className="text-botanist font-black uppercase tracking-[0.4em] text-[11px] mb-4">Positive Identification</p>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-3">{result.name}</h1>
                <p className="text-2xl italic text-botanist-dark font-extrabold opacity-70 mb-8">{result.botanicalName}</p>
                
                {/* Visual Conditions Summary Dashboard */}
                <div className="flex flex-wrap gap-3 mb-8">
                   {summaryChips.map((chip, idx) => chip.badge ? (
                     <div 
                       key={idx} 
                       className={`flex items-center space-x-3 px-5 py-2.5 rounded-2xl border transition-all hover:-translate-y-0.5 shadow-sm ${chip.badge.bg} ${chip.badge.color} border-current/10`}
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={chip.badge.icon} />
                       </svg>
                       <span className="text-[10px] font-black uppercase tracking-widest">{chip.badge.text}</span>
                     </div>
                   ) : null)}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-slate-100">{result.family}</span>
                  <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-slate-100">{result.origin}</span>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                {careItems.map((item, idx) => (
                  <AccordionItem key={idx} title={item.label} icon={item.icon} content={item.value} isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} colorClass={item.color} bgClass={item.bg} badge={item.badge} />
                ))}
              </div>
            </div>
            {result.isToxic && (
              <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 flex items-start space-x-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-inner flex-shrink-0"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg></div>
                <div><h4 className="text-red-900 font-black text-lg mb-2">Toxicity Alert</h4><p className="text-red-700/80 font-bold leading-relaxed">{result.toxicityDetails}</p></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 mt-12 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-1 w-full gap-3">
            <button 
              onClick={handleShare}
              className="flex-1 bg-slate-50 border-2 border-slate-100 text-slate-600 font-black px-6 py-5 rounded-[2rem] shadow-sm hover:border-botanist hover:bg-botanist/5 hover:text-botanist transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button 
              onClick={() => onAddReminder(result.name, result.careGuide.watering)}
              className="flex-1 bg-slate-900 text-white font-black px-6 py-5 rounded-[2rem] shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z" />
              </svg>
              Add Care Task
            </button>
          </div>
          <button 
            onClick={() => onNavigate(AppView.MAP)}
            className="w-full md:w-auto md:min-w-[280px] bg-botanist text-white font-black px-10 py-5 rounded-[2rem] shadow-xl shadow-botanist/20 hover:bg-botanist-dark transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center group/buy"
          >
            <svg className="w-6 h-6 mr-3 group-hover/buy:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Where to Buy
          </button>
        </div>

        {result.similarPlants && result.similarPlants.length > 0 && (
          <section className="animate-in slide-in-from-bottom-12 duration-1000 mt-20">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-1.5 h-10 bg-botanist rounded-full"></div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Similar Botanicals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {result.similarPlants.map((plant, idx) => (
                <div key={idx} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-botanist/5 transition-all duration-500 group relative overflow-hidden flex flex-col">
                  {compareLoading === plant.name && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                      <div className="w-8 h-8 border-[3px] border-botanist border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={plant.imageUrl || getPlaceholder(plant.name)} 
                      alt={plant.name} 
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!plant.imageUrl ? 'brightness-90 contrast-125' : ''}`}
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-2xl font-extrabold text-slate-800 group-hover:text-botanist transition-colors">{plant.name}</h4>
                      {plant.careMatch && <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Care Match</div>}
                    </div>
                    <p className="text-slate-500 font-semibold leading-relaxed mb-8 text-[15px] flex-1">{plant.reason}</p>
                    <div className="pt-6 border-t border-slate-50 mt-auto">
                      <button onClick={() => handleCompareRelative(plant.name)} className="text-botanist font-black text-xs uppercase tracking-[0.2em] flex items-center group-hover:translate-x-2 transition-transform w-full text-left">Compare Relative<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
                    </div>
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
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Flora Identification</h2>
        <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto opacity-80">Capture any plant with precision. Our AI uses high-density vision to identify thousands of species instantly.</p>
      </div>
      <div className="shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[4rem]">
        <CameraCapture onCapture={handleCapture} isLoading={loading} label="Snap Plant Identity" />
      </div>
    </div>
  );
};

export default IdentificationView;
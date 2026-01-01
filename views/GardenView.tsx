import React, { useState } from 'react';
import { PlantDetails, AppView } from '../types';

interface GardenViewProps {
  garden: PlantDetails[];
  onRemove: (id: string) => void;
  onUpdatePlant: (plant: PlantDetails) => void;
  onNavigate: (view: AppView) => void;
  onViewDetails: (plant: PlantDetails) => void;
}

const AVAILABLE_ICONS = [
  { id: 'leaf', path: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Leaf' },
  { id: 'flower', path: 'M10 2a8 8 0 100 16 8 8 0 000-16z M10 14a4 4 0 110-8 4 4 0 010 8z', label: 'Flower' },
  { id: 'tree', path: 'M12 2L3 12h3v8h12v-8h3L12 2z', label: 'Tree' },
  { id: 'cactus', path: 'M12 2v20M8 8v8M16 8v8M5 10v4M19 10v4', label: 'Cactus' },
  { id: 'sprout', path: 'M12 21V9m0 0a5 5 0 115-5m-5 5a5 5 0 10-5-5', label: 'Sprout' },
  { id: 'pot', path: 'M6 3h12l-1 14H7L6 3z M6 3v1M18 3v1', label: 'Pot' },
  { id: 'sun', path: 'M12 2v2m0 16v2m8-10h2M2 12h2m13.657-7.657l-1.414 1.414m-10.486 10.486l-1.414 1.414m12.314-1.414l-1.414-1.414M6.343 6.343l-1.414-1.414M12 7a5 5 0 100 10 5 5 0 000-10z', label: 'Sun' },
  { id: 'water', path: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z', label: 'Water' }
];

const GardenView: React.FC<GardenViewProps> = ({ garden, onRemove, onUpdatePlant, onNavigate, onViewDetails }) => {
  const [iconPickerId, setIconPickerId] = useState<string | null>(null);

  const handleSelectIcon = (e: React.MouseEvent, plant: PlantDetails, iconId: string) => {
    e.stopPropagation();
    onUpdatePlant({ ...plant, customIcon: iconId });
    setIconPickerId(null);
  };

  const getIconPath = (iconId?: string) => {
    const icon = AVAILABLE_ICONS.find(i => i.id === iconId);
    return icon ? icon.path : 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z';
  };

  if (garden.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[4rem] border-[3px] border-dashed border-slate-100 shadow-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-botanist/10 rounded-[2.5rem] flex items-center justify-center mb-8 text-botanist shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253v13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v-13z" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Your Garden is Empty</h3>
        <p className="text-slate-400 max-w-md font-semibold text-lg leading-relaxed mb-8">Start identifying plants to add them to your collection and receive tailored care advice.</p>
        <button 
          onClick={() => onNavigate(AppView.IDENTIFY)}
          className="bg-botanist text-white font-black px-10 py-4 rounded-full shadow-xl shadow-botanist/20 hover:-translate-y-1 transition-all"
        >
          Identify New Plant
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My Garden</h2>
          <p className="text-slate-400 font-bold text-base">A sanctuary of your botanical companions.</p>
        </div>
        <div className="bg-botanist/10 px-6 py-2 rounded-full text-botanist text-xs font-black uppercase tracking-widest border border-botanist/5">
          {garden.length} Total Plants
        </div>
      </div>

      <div className="space-y-10">
        {garden.map((plant) => (
          <div 
            key={plant.id} 
            onClick={() => onViewDetails(plant)}
            className="group relative bg-white rounded-[3.5rem] overflow-hidden shadow-xl border border-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-botanist/10 cursor-pointer w-full"
          >
            {/* Image Section */}
            <div className="relative h-80 overflow-hidden">
              <img 
                src={plant.imageUrl || "https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=800&auto=format&fit=crop"} 
                alt={plant.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIconPickerId(iconPickerId === plant.id ? null : plant.id);
                  }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-white hover:bg-botanist transition-all shadow-lg group/icon"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={getIconPath(plant.customIcon)} />
                  </svg>
                </button>

                {iconPickerId === plant.id && (
                  <div className="absolute top-14 left-0 bg-white/95 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-2xl z-50 flex flex-wrap gap-2 w-48 animate-in zoom-in-90 duration-200">
                    <p className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Icon Preference</p>
                    {AVAILABLE_ICONS.map(icon => (
                      <button
                        key={icon.id}
                        onClick={(e) => handleSelectIcon(e, plant, icon.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${plant.customIcon === icon.id ? 'bg-botanist text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon.path} />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute top-6 right-6">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(plant.id);
                  }}
                  className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl text-white/70 hover:bg-red-500 hover:text-white transition-all border border-white/10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="absolute bottom-10 left-10">
                <h4 className="text-5xl font-black text-white tracking-tight leading-none mb-2">{plant.name}</h4>
                <p className="text-botanist font-bold italic text-xl opacity-90">{plant.botanicalName}</p>
              </div>
            </div>

            {/* Care Info Section */}
            <div className="p-10 md:p-12">
              <div className="space-y-6 mb-12">
                <div className="flex items-start">
                  <div className="flex items-center space-x-3 w-32 flex-shrink-0 pt-1">
                    <div className="w-1.5 h-6 bg-botanist rounded-full"></div>
                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Water:</span>
                  </div>
                  <p className="text-slate-700 font-bold text-lg leading-relaxed">{plant.careGuide.watering}</p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center space-x-3 w-32 flex-shrink-0 pt-1">
                    <div className="w-1.5 h-6 bg-botanist rounded-full"></div>
                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Light:</span>
                  </div>
                  <p className="text-slate-700 font-bold text-lg leading-relaxed">{plant.careGuide.light}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(AppView.REMINDERS);
                  }}
                  className="flex-1 bg-botanist text-white px-8 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-botanist-dark transition-all shadow-xl shadow-botanist/10"
                >
                  Schedule Care
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(plant);
                  }}
                  className="flex-1 bg-white border-2 border-botanist/20 text-botanist px-8 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-botanist hover:text-white transition-all"
                >
                  Full Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GardenView;
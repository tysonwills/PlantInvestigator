
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
    e.stopPropagation(); // Prevent card click
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">My Garden</h2>
          <p className="text-slate-400 font-bold text-lg">A personalized sanctuary of your botanical companions.</p>
        </div>
        <div className="bg-botanist/10 px-6 py-3 rounded-full text-botanist text-sm font-black uppercase tracking-widest border border-botanist/5">
          {garden.length} Total Plants
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {garden.map((plant) => (
          <div 
            key={plant.id} 
            onClick={() => onViewDetails(plant)}
            className="group relative bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-botanist/10 hover:-translate-y-2 cursor-pointer"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={plant.imageUrl || "https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400&auto=format&fit=crop"} 
                alt={plant.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              
              {/* Custom Icon Overlay */}
              <div className="absolute top-4 left-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIconPickerId(iconPickerId === plant.id ? null : plant.id);
                  }}
                  className="w-12 h-12 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center text-white hover:bg-botanist transition-all shadow-lg group/icon"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={getIconPath(plant.customIcon)} />
                  </svg>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                    <svg className="w-2 h-2 text-botanist" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                  </div>
                </button>

                {/* Icon Picker Popover */}
                {iconPickerId === plant.id && (
                  <div className="absolute top-14 left-0 bg-white/95 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-2xl z-50 flex flex-wrap gap-2 w-48 animate-in zoom-in-90 duration-200">
                    <p className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Select Custom Icon</p>
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
                    <button
                      onClick={(e) => handleSelectIcon(e, plant, '')}
                      className="w-full mt-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 py-2"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(plant.id);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors border border-white/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h4 className="text-2xl font-extrabold text-white tracking-tight">{plant.name}</h4>
                <p className="text-botanist font-bold italic text-sm">{plant.botanicalName}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm font-bold text-slate-500">
                  <div className="w-2 h-2 bg-botanist rounded-full mr-3"></div>
                  <span className="opacity-70 mr-2">Water:</span> {plant.careGuide.watering}
                </div>
                <div className="flex items-center text-sm font-bold text-slate-500">
                  <div className="w-2 h-2 bg-botanist rounded-full mr-3"></div>
                  <span className="opacity-70 mr-2">Light:</span> {plant.careGuide.light}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(AppView.REMINDERS);
                  }}
                  className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-botanist transition-colors"
                >
                  Schedule Care
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(AppView.DIAGNOSE);
                  }}
                  className="flex-1 bg-botanist/10 text-botanist px-4 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-botanist hover:text-white transition-colors border border-botanist/5"
                >
                  Diagnose
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

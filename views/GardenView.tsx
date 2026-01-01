
import React, { useState } from 'react';
import { PlantDetails, AppView } from '../types';

interface GardenViewProps {
  garden: PlantDetails[];
  onRemove: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

const GardenView: React.FC<GardenViewProps> = ({ garden, onRemove, onNavigate }) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);

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
            className="group relative bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-botanist/10 hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={plant.imageUrl || "https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400&auto=format&fit=crop"} 
                alt={plant.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => onRemove(plant.id)}
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
                  onClick={() => onNavigate(AppView.REMINDERS)}
                  className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-botanist transition-colors"
                >
                  Schedule Care
                </button>
                <button 
                  onClick={() => onNavigate(AppView.DIAGNOSE)}
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

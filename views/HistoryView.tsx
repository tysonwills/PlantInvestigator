import React, { useState } from 'react';
import { HistoryItem, PlantDetails, Diagnosis } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[4rem] border-[3px] border-dashed border-slate-100 shadow-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 text-slate-300 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Journal is Empty</h3>
        <p className="text-slate-400 max-w-md font-semibold text-lg leading-relaxed">Your botanical discoveries and health logs will appear here as you grow your collection.</p>
      </div>
    );
  }

  const renderExpandedPlant = (data: PlantDetails) => (
    <div className="mt-8 pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Description</h5>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">{data.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-100">{data.family}</span>
            <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-100">{data.origin}</span>
            {data.isToxic && <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-red-100">Toxic</span>}
            {data.isWeed && <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-orange-100">Weed</span>}
          </div>
          {data.isToxic && (
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
               <h6 className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">Toxicity Info</h6>
               <p className="text-red-700/80 text-[11px] font-bold italic leading-relaxed">{data.toxicityDetails}</p>
            </div>
          )}
        </div>
        <div className="bg-botanist/5 p-6 rounded-[2rem] space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-botanist mb-2">Quick Care Guide</h5>
          <div className="space-y-3">
            <div className="flex items-center text-xs font-bold text-slate-700">
              <span className="w-1.5 h-1.5 bg-botanist rounded-full mr-3"></span>
              <span className="opacity-70 mr-2">Water:</span> {data.careGuide.watering}
            </div>
            <div className="flex items-center text-xs font-bold text-slate-700">
              <span className="w-1.5 h-1.5 bg-botanist rounded-full mr-3"></span>
              <span className="opacity-70 mr-2">Light:</span> {data.careGuide.light}
            </div>
            <div className="flex items-center text-xs font-bold text-slate-700">
              <span className="w-1.5 h-1.5 bg-botanist rounded-full mr-3"></span>
              <span className="opacity-70 mr-2">Soil:</span> {data.careGuide.soil}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpandedDiagnosis = (data: Diagnosis) => (
    <div className="mt-8 pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2">Symptoms Detected</h5>
            <ul className="space-y-2">
              {data.symptoms.map((s, i) => (
                <li key={i} className="flex items-center text-sm font-semibold text-slate-600">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 flex-shrink-0"></div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Severity</h5>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              data.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
              data.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {data.severity} Priority
            </span>
          </div>
        </div>
        <div className="bg-blue-50/50 p-6 rounded-[2rem] space-y-4 border border-blue-100/50">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Recommended Treatment</h5>
          <ul className="space-y-3">
            {data.treatment.slice(0, 3).map((t, i) => (
              <li key={i} className="flex items-start text-xs font-bold text-slate-700">
                <span className="text-blue-400 mr-2">{i + 1}.</span>
                {t}
              </li>
            ))}
            {data.treatment.length > 3 && <li className="text-[10px] text-slate-400 font-bold italic">+{data.treatment.length - 3} more steps...</li>}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Garden Journal</h2>
          <p className="text-slate-400 font-bold text-lg">Detailed logs of your plant interactions and diagnostics.</p>
        </div>
        <div className="bg-botanist/10 px-6 py-3 rounded-full text-botanist text-sm font-black uppercase tracking-widest border border-botanist/5">
          {history.length} Chronological Entries
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {history.map((item) => {
          const date = new Date(item.timestamp);
          const isExpanded = expandedId === item.id;

          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100/50 transition-all duration-500 group ${isExpanded ? 'ring-2 ring-botanist/20 shadow-xl' : 'hover:shadow-2xl hover:shadow-botanist/5'}`}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className={`relative h-64 md:h-auto md:w-80 flex-shrink-0 overflow-hidden`}>
                  <img src={item.imageUrl} alt="History Item" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 flex space-x-2">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border border-white/20 ${item.type === 'identification' ? 'bg-botanist/80 text-white' : 'bg-amber-500/80 text-white'}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em]">Captured</p>
                    <p className="text-white font-bold text-sm">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        {item.type === 'identification' ? (
                          <>
                            <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-botanist transition-colors">
                              {(item.data as PlantDetails).name}
                            </h4>
                            <p className="text-botanist-dark font-bold italic opacity-70 mt-1">
                              {(item.data as PlantDetails).botanicalName}
                            </p>
                          </>
                        ) : (
                          <>
                            <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-botanist transition-colors">
                              {(item.data as Diagnosis).condition}
                            </h4>
                            <p className="text-botanist-dark font-bold italic opacity-70 mt-1">Health Diagnosis</p>
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`p-4 rounded-2xl transition-all duration-300 ml-4 ${isExpanded ? 'bg-botanist text-white' : 'bg-slate-50 text-slate-400 hover:bg-botanist/10 hover:text-botanist'}`}
                      >
                        <svg className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {isExpanded && (
                      item.type === 'identification' ? renderExpandedPlant(item.data as PlantDetails) : renderExpandedDiagnosis(item.data as Diagnosis)
                    )}
                  </div>

                  {!isExpanded && (
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-botanist rounded-full"></div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Validated AI Log</span>
                      </div>
                      <button 
                        onClick={() => setExpandedId(item.id)}
                        className="text-botanist font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-all flex items-center"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
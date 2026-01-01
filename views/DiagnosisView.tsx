
import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import { diagnosePlant } from '../geminiService';
import { Diagnosis } from '../types';

interface DiagnosisViewProps {
  onResult: (data: Diagnosis, imageUrl: string) => void;
}

const DiagnosisView: React.FC<DiagnosisViewProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setLoading(true);
    setCapturedImage(`data:image/jpeg;base64,${base64}`);
    try {
      const data = await diagnosePlant(base64);
      setResult(data);
      onResult(data, `data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error("Diagnosis failed", error);
      alert("Failed to analyze plant health. Please check your image clarity.");
    } finally {
      setLoading(false);
    }
  };

  if (result && capturedImage) {
    const severityColors = {
      low: 'bg-botanist/10 text-botanist border-botanist/20',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <button 
          onClick={() => setResult(null)}
          className="group flex items-center space-x-3 text-botanist hover:text-botanist-dark font-extrabold px-6 py-3 rounded-full hover:bg-botanist/5 transition-all w-fit"
        >
          <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-[15px]">New Diagnosis</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl h-fit border border-slate-50 bg-white">
            <img src={capturedImage} alt="Unhealthy Plant" className="w-full h-[450px] object-cover" />
            <div className="p-12">
              <div className="flex flex-wrap items-center justify-between mb-10 gap-6">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{result.condition}</h2>
                <span className={`${severityColors[result.severity]} px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm`}>
                  {result.severity} Priority
                </span>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">Symptom Log</h4>
                  <div className="flex flex-wrap gap-3">
                    {result.symptoms.map(s => (
                      <span key={s} className="bg-slate-50 text-slate-800 px-5 py-3 rounded-full text-sm font-bold border border-slate-100 shadow-sm">{s}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">Potential Causes</h4>
                  <div className="space-y-4">
                    {result.causes.map(c => (
                      <div key={c} className="flex items-center text-slate-600 text-[15px] font-bold">
                        <div className="w-3 h-3 bg-amber-400 rounded-full mr-5 shadow-[0_0_10px_rgba(251,191,36,0.4)]"></div>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-botanist text-white p-12 rounded-[3.5rem] shadow-2xl shadow-botanist/30 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-10 flex items-center tracking-tight">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-6 border border-white/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                  </div>
                  Treatment Protocol
                </h3>
                <div className="space-y-5">
                  {result.treatment.map((step, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-[2.25rem] border border-white/10 flex space-x-6 group hover:bg-white/20 transition-all cursor-default">
                      <span className="text-white/40 font-black text-2xl italic leading-none pt-1">{String(idx + 1).padStart(2, '0')}</span>
                      <p className="text-white font-bold leading-relaxed opacity-95 text-base">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40"></div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-xl">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center tracking-tight">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mr-6 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1" /></svg>
                </div>
                Future Prevention
              </h3>
              <div className="grid grid-cols-1 gap-5">
                {result.prevention.map(p => (
                  <div key={p} className="flex items-center space-x-5 text-slate-700 text-[15px] font-extrabold p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-slate-50 transition-colors">
                    <div className="p-1.5 bg-botanist/20 rounded-xl flex-shrink-0 shadow-sm">
                      <svg className="w-5 h-5 text-botanist" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Plant Doctor</h2>
        <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto opacity-80">Heal your garden with instant diagnostics. Deep-learning pest and disease identification.</p>
      </div>
      <div className="shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[4rem]">
        <CameraCapture onCapture={handleCapture} isLoading={loading} label="Snap Health Issue" />
      </div>
    </div>
  );
};

export default DiagnosisView;

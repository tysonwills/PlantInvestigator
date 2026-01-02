
import React, { useEffect, useRef, useState } from 'react';

const LightMeterView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [luminance, setLuminance] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Camera access is required for the Light Meter. Please check your permissions.");
        console.error(err);
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    let animationId: number;
    const analyze = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let totalLuminance = 0;

          // Sample every 4th pixel for performance
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Standard relative luminance formula
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            totalLuminance += lum;
          }
          
          const avgLum = totalLuminance / (data.length / 16);
          // Map 0-255 to a 0-100 scale for user friendly display
          setLuminance(Math.round((avgLum / 255) * 100));
        }
      }
      animationId = requestAnimationFrame(analyze);
    };
    analyze();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getLightCategory = (lum: number) => {
    if (lum < 25) return { 
      label: 'Low Light', 
      desc: 'Deep shade or North window.', 
      plants: 'Snake Plants, ZZ Plants, Pothos',
      color: 'text-slate-500',
      bg: 'bg-slate-100'
    };
    if (lum < 60) return { 
      label: 'Indirect Light', 
      desc: 'Bright room, no direct rays.', 
      plants: 'Monstera, Calathea, Philodendron',
      color: 'text-botanist',
      bg: 'bg-botanist/10'
    };
    return { 
      label: 'Direct Light', 
      desc: 'Full sun exposure.', 
      plants: 'Cacti, Succulents, Bird of Paradise',
      color: 'text-amber-500', 
      bg: 'bg-amber-50'
    };
  };

  const category = getLightCategory(luminance);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Horticultural Lux Meter</h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto opacity-80">
          Point your camera at a plant spot to analyze real-time luminosity and find the perfect botanical match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera View */}
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[3/4]">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <p className="text-white font-bold">{error}</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
              />
              <canvas ref={canvasRef} width="100" height="100" className="hidden" />
              
              {/* Scanning Overlay UI */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-botanist/40 rounded-full animate-pulse flex items-center justify-center">
                   <div className="w-48 h-48 border-2 border-botanist/20 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-black uppercase text-[10px] tracking-widest">Spectral Density</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-1 h-3 rounded-full ${luminance > i * 20 ? 'bg-botanist' : 'bg-white/20'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Meter & Recommendations */}
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 mb-8">
              {/* Simple SVG Circular Meter */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * luminance) / 100}
                  className={`transition-all duration-500 ease-out ${category.color.replace('text-', 'stroke-')}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900 leading-none">{luminance}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Intensity</span>
              </div>
            </div>

            <div className={`px-8 py-3 rounded-full ${category.bg} ${category.color} font-black text-sm uppercase tracking-[0.2em] mb-4`}>
              {category.label}
            </div>
            <p className="text-slate-500 font-semibold leading-relaxed">{category.desc}</p>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Recommended Botanicals</h4>
             <div className="space-y-4">
                {category.plants.split(', ').map((plant, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-botanist/30 transition-all group">
                    <div className={`w-10 h-10 rounded-xl ${category.bg} ${category.color} flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                    </div>
                    <span className="text-slate-700 font-bold">{plant}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      
      <div className="bg-botanist p-10 rounded-[3rem] text-white shadow-xl shadow-botanist/20 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-3">Gardener's Insight</h3>
          <p className="text-white/90 font-medium leading-relaxed">
            Light levels change throughout the day. For the most accurate reading, test your position at noon. Remember that window orientation (North vs South) significantly affects available photosynthetic energy!
          </p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
      </div>
    </div>
  );
};

export default LightMeterView;

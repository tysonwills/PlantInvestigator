
import React, { useState, useEffect } from 'react';
import { getNearbyGardenCenters } from '../geminiService';

const MapView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ text: string; chunks: any[] } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchCenters = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await getNearbyGardenCenters(
            position.coords.latitude,
            position.coords.longitude
          );
          setData(result);
        } catch (err) {
          setError("Failed to fetch nearby centers. Our AI is having trouble connecting to map data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError("Location access denied. We need your location to find the closest botanical experts.");
        } else {
          setError("We couldn't determine your precise location. Please check your signal and try again.");
        }
        console.error(err);
      },
      options
    );
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Nearby Garden Centers</h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto opacity-80">Discover local nurseries, specialist plant shops, and gardening experts in your area.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] shadow-sm border border-slate-50">
          <div className="w-24 h-24 mb-10 relative">
            <div className="absolute inset-0 border-[6px] border-botanist/10 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-botanist border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-botanist/5 rounded-full flex items-center justify-center text-botanist">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">Finding Local Gems</h3>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Triangulating your coordinates...</p>
        </div>
      ) : permissionDenied ? (
        <div className="bg-amber-50 border border-amber-100 p-16 rounded-[4rem] text-center max-w-2xl mx-auto shadow-xl">
          <div className="w-24 h-24 bg-amber-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-amber-600 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg>
          </div>
          <h3 className="text-3xl font-black text-amber-900 mb-4 tracking-tight">Location Permission Needed</h3>
          <p className="text-amber-700/80 font-bold text-lg mb-10 leading-relaxed">To find the best nurseries near you, please enable location services in your browser settings for FloraGenius.</p>
          <button 
            onClick={fetchCenters}
            className="bg-amber-600 text-white font-black py-5 px-12 rounded-full hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 active:scale-95 text-lg"
          >
            Allow Access & Retry
          </button>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-16 rounded-[4rem] text-center max-w-2xl mx-auto shadow-xl">
          <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-red-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-red-900 mb-4">{error}</h3>
          <button 
            onClick={fetchCenters}
            className="bg-red-600 text-white font-black py-5 px-12 rounded-full hover:bg-red-700 transition-all shadow-lg active:scale-95"
          >
            Retry Search
          </button>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-50">
            <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-botanist/10 rounded-[1.75rem] flex items-center justify-center text-botanist shadow-inner">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">AI Curated Nurseries</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Real-time Grounded Analysis</p>
                </div>
              </div>
              <button 
                onClick={fetchCenters}
                className="text-botanist font-black text-xs uppercase tracking-[0.2em] bg-botanist/5 px-6 py-3 rounded-full border border-botanist/10 hover:bg-botanist hover:text-white transition-all"
              >
                Refresh List
              </button>
            </div>

            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-xl text-slate-600 font-semibold leading-relaxed mb-16 px-4 border-l-4 border-botanist/20">
                {data.text}
              </div>
            </div>

            {/* Citations/Links Section */}
            {data.chunks.length > 0 && (
              <div className="mt-16 pt-16 border-t border-slate-100">
                <div className="flex items-center space-x-3 mb-10">
                  <span className="w-2 h-2 bg-botanist rounded-full"></span>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-[0.1em]">Direct Navigation Links</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.chunks.map((chunk: any, i: number) => {
                    if (chunk.maps) {
                      return (
                        <a 
                          key={i}
                          href={chunk.maps.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-slate-50 hover:bg-botanist text-slate-800 hover:text-white border border-slate-100 rounded-[2.5rem] p-7 transition-all duration-500 flex items-center space-x-5 shadow-sm hover:shadow-xl hover:shadow-botanist/20 hover:-translate-y-1"
                        >
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-botanist shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black truncate tracking-tight text-lg">{chunk.maps.title || 'View Place'}</p>
                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mt-1 group-hover:opacity-100">Open Google Maps</p>
                          </div>
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MapView;

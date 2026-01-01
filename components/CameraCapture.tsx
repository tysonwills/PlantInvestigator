
import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  isLoading: boolean;
  label: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFile = (file: File) => {
    if (file) {
      // Trigger visual capture feedback
      setIsCapturing(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        
        // Brief delay to allow the "shutter" animation to be perceived
        setTimeout(() => {
          onCapture(base64);
          setIsCapturing(false);
        }, 450);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative group border-[3px] border-dashed rounded-[4rem] p-12 md:p-20 transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
        ${dragActive ? 'border-botanist bg-botanist/5 shadow-2xl' : 'border-slate-100 hover:border-botanist/30 bg-white hover:bg-slate-50'}
        ${isCapturing ? 'border-botanist scale-[0.97] ring-[12px] ring-botanist/10' : ''}
        ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={onFileChange}
        className="hidden"
      />
      
      {/* Camera Shutter Flash Effect */}
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150 ${isCapturing ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`w-24 h-24 md:w-32 md:h-32 bg-botanist/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-inner ${isLoading || isCapturing ? 'animate-pulse' : ''}`}>
        <svg className="w-10 h-10 md:w-14 md:h-14 text-botanist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">{isCapturing ? "Image Captured!" : label}</h3>
      <p className="text-slate-400 max-w-sm font-semibold leading-relaxed">Tap to snap or drag an image here. Elite AI analysis starts instantly.</p>

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-[4rem] z-20 animate-in fade-in duration-300">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-[6px] border-botanist/20 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-botanist border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-botanist font-black text-xl tracking-tight">Deciphering Flora...</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;

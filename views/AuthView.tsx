
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthViewProps {
  onAuth: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const user = authService.login(email, password);
        onAuth(user);
      } else {
        const user = authService.signUp(email, password);
        onAuth(user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-smoke overflow-hidden">
      <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 relative overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* Plant Image Side Panel */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1200&auto=format&fit=crop" 
            alt="Botanical Identity" 
            className="absolute inset-0 w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[3000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-botanist/40 to-transparent"></div>
          <div className="absolute bottom-16 left-16 right-16 text-white">
            <h3 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">Intelligence for the Green-Thumbed.</h3>
            <p className="text-xl font-medium opacity-90">Join 50,000+ botanists using AI to nurture their garden to perfection.</p>
          </div>
        </div>

        {/* Auth Form Panel */}
        <div className="flex-1 p-14 md:p-20 relative z-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-botanist rounded-[2.25rem] flex items-center justify-center mb-10 text-white shadow-3xl shadow-botanist/40 rotate-12 hover:rotate-0 transition-all duration-700 ease-out cursor-default">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21a9.003 9.003 0 008.354-5.646z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646" />
            </svg>
          </div>
          
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight text-center leading-tight">
            {isLogin ? 'Hello Again' : 'Join the Garden'}
          </h2>
          <p className="text-slate-400 mb-8 font-semibold text-center text-lg opacity-80 max-w-sm">Access your elite botanical intelligence platform.</p>

          {error && (
            <div className="w-full max-w-md bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-6 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-6 block">Email Identity</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-full px-10 py-5 transition-all text-slate-800 font-extrabold shadow-inner text-lg placeholder-slate-300 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-6 block">Secure Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-full px-10 py-5 transition-all text-slate-800 font-extrabold shadow-inner text-lg placeholder-slate-300 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-botanist hover:bg-botanist-dark text-white font-black text-xl py-6 rounded-full transition-all shadow-2xl shadow-botanist/30 hover:-translate-y-2 active:translate-y-0 mt-8 tracking-tight">
              {isLogin ? 'Enter Garden' : 'Create Identity'}
            </button>
          </form>

          <p className="mt-12 text-slate-500 font-bold text-center text-[15px]">
            {isLogin ? "No roots yet?" : "Already blooming?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-3 text-botanist font-black hover:underline underline-offset-8 transition-all"
            >
              {isLogin ? 'Join Hub' : 'Enter Now'}
            </button>
          </p>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-botanist/5 rounded-full blur-[80px] -ml-24 -mt-24"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-botanist/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
      </div>
    </div>
  );
};

export default AuthView;

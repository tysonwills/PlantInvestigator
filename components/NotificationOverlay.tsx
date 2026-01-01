
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';

interface NotificationOverlayProps {
  reminders: Reminder[];
  onDismiss: () => void;
  onViewReminders: () => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ reminders, onDismiss, onViewReminders }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Filter for tasks due today or overdue
  const today = new Date().toISOString().split('T')[0];
  const dueReminders = reminders.filter(r => r.nextDue <= today);

  useEffect(() => {
    if (dueReminders.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [dueReminders.length]);

  if (dueReminders.length === 0 || !isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2.5rem)] max-w-xl animate-in slide-in-from-top-12 duration-500 ease-out">
      <div className="bg-white rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] border-2 border-botanist/20 flex flex-col sm:flex-row items-center gap-8 ring-4 ring-botanist/5">
        
        {/* Animated Icon Container */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-botanist rounded-[2rem] animate-ping opacity-20 scale-125"></div>
          <div className="relative w-24 h-24 bg-botanist rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-botanist/30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 bg-botanist/10 px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 bg-botanist rounded-full animate-pulse"></span>
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-botanist">High Priority Alert</h4>
          </div>
          <h3 className="text-slate-900 font-black text-2xl tracking-tight leading-tight mb-2">
            Your Garden Needs You
          </h3>
          <p className="text-slate-600 font-bold text-lg mb-1">
            {dueReminders.length} task{dueReminders.length > 1 ? 's are' : ' is'} due for attention
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-slate-400 font-semibold text-sm italic">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="truncate max-w-[200px]">{dueReminders[0].plantName}: {dueReminders[0].task}</span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
          <button 
            onClick={() => {
              setIsVisible(false);
              onViewReminders();
            }}
            className="flex-1 sm:flex-none px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-black text-xs uppercase tracking-widest">View All</span>
          </button>
          <button 
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sm:hidden font-black text-xs uppercase tracking-widest ml-2">Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationOverlay;

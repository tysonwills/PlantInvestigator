
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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-12 duration-500 ease-out">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-5 ring-1 ring-slate-900/5">
        <div className="w-16 h-16 bg-botanist rounded-3xl flex items-center justify-center text-white shadow-lg shadow-botanist/20 flex-shrink-0">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-botanist mb-0.5">Garden Alert</h4>
          <p className="text-slate-900 font-extrabold text-[15px] truncate">
            {dueReminders.length} task{dueReminders.length > 1 ? 's' : ''} due today
          </p>
          <p className="text-slate-500 text-xs font-bold truncate opacity-80">
            {dueReminders[0].plantName}: {dueReminders[0].task}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => {
              setIsVisible(false);
              onViewReminders();
            }}
            className="p-2.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button 
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="p-2.5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationOverlay;

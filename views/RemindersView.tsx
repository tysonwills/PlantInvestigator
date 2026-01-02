import React, { useState } from 'react';
import { Reminder, PlantDetails } from '../types';

interface RemindersViewProps {
  reminders: Reminder[];
  garden: PlantDetails[];
  onAdd: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const RemindersView: React.FC<RemindersViewProps> = ({ reminders, garden, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    plantName: '',
    plantId: '',
    task: 'Watering' as Reminder['task'],
    frequency: 'Daily',
    nextDue: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plantName || !form.nextDue) return;

    onAdd({
      id: crypto.randomUUID(),
      ...form
    });
    setForm({ plantName: '', plantId: '', task: 'Watering', frequency: 'Daily', nextDue: '', notes: '' });
    setShowAdd(false);
  };

  const handleSelectFromGarden = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === "manual") {
      setForm({ ...form, plantId: '', plantName: '' });
    } else {
      const plant = garden.find(p => p.id === selectedId);
      if (plant) {
        setForm({ 
          ...form, 
          plantId: plant.id, 
          plantName: plant.name,
          frequency: plant.careGuide.watering.toLowerCase().includes('week') ? 'Weekly' : 'Every 3 days',
          notes: `Suggested: ${plant.careGuide.watering}`
        });
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Care Reminders</h2>
          <p className="text-slate-400 font-bold text-lg">Never miss a watering or fertilization session again.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-botanist text-white font-black px-8 py-4 rounded-full shadow-lg shadow-botanist/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          {showAdd ? 'Close Form' : '+ New Reminder'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 animate-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {garden.length > 0 && (
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-botanist uppercase tracking-widest ml-4">Select From Garden</label>
                <select 
                  className="w-full bg-botanist/5 border-2 border-botanist/10 focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-extrabold text-botanist-dark"
                  value={form.plantId || "manual"}
                  onChange={handleSelectFromGarden}
                >
                  <option value="manual">-- Manual Entry --</option>
                  {garden.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.botanicalName})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Plant Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold"
                placeholder="Monstera Deliciosa..."
                value={form.plantName}
                onChange={e => setForm({...form, plantName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Task Type</label>
              <select 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold"
                value={form.task}
                onChange={e => setForm({...form, task: e.target.value as any})}
              >
                <option>Watering</option>
                <option>Fertilizing</option>
                <option>Pruning</option>
                <option>Repotting</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Frequency</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold"
                placeholder="Every 3 days..."
                value={form.frequency}
                onChange={e => setForm({...form, frequency: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Next Due Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold"
                value={form.nextDue}
                onChange={e => setForm({...form, nextDue: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Notes</label>
              <textarea 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-botanist/30 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold resize-none"
                rows={2}
                placeholder="Use rainwater only..."
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-botanist text-white font-black py-5 rounded-full hover:bg-botanist-dark transition-all shadow-lg shadow-botanist/20">Save Care Task</button>
            </div>
          </form>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[4rem] border-[3px] border-dashed border-slate-100 flex flex-col items-center">
           <div className="w-20 h-20 bg-botanist/5 rounded-full flex items-center justify-center text-botanist mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <p className="text-slate-400 font-bold text-lg">No active reminders. Start by adding your first plant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-botanist/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-botanist/10 rounded-2xl text-botanist">
                    {reminder.task === 'Watering' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}
                    {reminder.task === 'Fertilizing' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" /></svg>}
                    {(reminder.task === 'Pruning' || reminder.task === 'Repotting' || reminder.task === 'Other') && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-3.07-4.59-3.07-4.97 0l-.33 2.65a1.5 1.5 0 01-1.31 1.31l-2.65.33c-3.07.38-3.07 4.59 0 4.97l2.65.33a1.5 1.5 0 011.31 1.31l.33 2.65c.38 3.07 4.59 3.07 4.97 0l.33-2.65a1.5 1.5 0 011.31-1.31l2.65-.33c3.07-.38 3.07-4.59 0-4.97l-2.65-.33a1.5 1.5 0 01-1.31-1.31l-.33-2.65zM9 13a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" /></svg>}
                  </div>
                  <button 
                    onClick={() => onDelete(reminder.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <h4 className="text-xl font-black text-slate-800 mb-1">{reminder.plantName}</h4>
                <p className="text-botanist font-bold text-sm mb-6 uppercase tracking-widest">{reminder.task}</p>

                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center text-sm font-bold text-slate-500">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Due: {new Date(reminder.nextDue).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm font-bold text-slate-500">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Frequency: {reminder.frequency}
                  </div>
                </div>

                {reminder.notes && (
                  <p className="mt-6 text-sm text-slate-400 italic bg-slate-50 p-4 rounded-2xl line-clamp-2">{reminder.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemindersView;

import React, { useState, useEffect } from 'react';
import { AppView, User, PlantDetails, Diagnosis, Reminder } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomBar from './components/BottomBar';
import LandingView from './views/LandingView';
import IdentificationView from './views/IdentificationView';
import DiagnosisView from './views/DiagnosisView';
import UpgradeView from './views/UpgradeView';
import AuthView from './views/AuthView';
import MapView from './views/MapView';
import RemindersView from './views/RemindersView';
import GardenView from './views/GardenView';
import AccountView from './views/AccountView';
import NotificationOverlay from './components/NotificationOverlay';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [garden, setGarden] = useState<PlantDetails[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [hasDismissedNotification, setHasDismissedNotification] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);

  // Initialize Auth, Garden & Reminders
  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session);
    
    const savedGarden = localStorage.getItem('flora_garden');
    if (savedGarden) setGarden(JSON.parse(savedGarden));

    const savedReminders = localStorage.getItem('flora_reminders');
    if (savedReminders) setReminders(JSON.parse(savedReminders));

    // Check for API key selection if environment requires it
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeyMissing(!hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenApiKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setIsApiKeyMissing(false);
    }
  };

  const handleIdentificationResult = (plant: PlantDetails, imageUrl: string) => {
    addToGarden({ ...plant, imageUrl });
  };

  const handleDiagnosisResult = (diagnosis: Diagnosis, imageUrl: string) => {
    // Single view diagnosis
  };

  const addToGarden = (plant: PlantDetails) => {
    if (garden.some(p => p.id === plant.id)) return;
    
    const newGarden = [plant, ...garden];
    setGarden(newGarden);
    localStorage.setItem('flora_garden', JSON.stringify(newGarden));
  };

  const handleUpdatePlant = (updatedPlant: PlantDetails) => {
    const newGarden = garden.map(p => p.id === updatedPlant.id ? updatedPlant : p);
    setGarden(newGarden);
    localStorage.setItem('flora_garden', JSON.stringify(newGarden));
  };

  const removeFromGarden = (id: string) => {
    const newGarden = garden.filter(p => p.id !== id);
    setGarden(newGarden);
    localStorage.setItem('flora_garden', JSON.stringify(newGarden));
  };

  const addReminder = (reminder: Reminder) => {
    const newReminders = [reminder, ...reminders];
    setReminders(newReminders);
    localStorage.setItem('flora_reminders', JSON.stringify(newReminders));
  };

  const deleteReminder = (id: string) => {
    const newReminders = reminders.filter(r => r.id !== id);
    setReminders(newReminders);
    localStorage.setItem('flora_reminders', JSON.stringify(newReminders));
  };

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    setCurrentView(AppView.LANDING);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView(AppView.AUTH);
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser = authService.upgradeUser(user.email);
      setUser(updatedUser);
      alert("Payment Successful! You are now a PRO member.");
    }
  };

  const handleNavigate = (view: AppView) => {
    if (view !== AppView.IDENTIFY) {
      setSelectedPlant(null);
    }
    setCurrentView(view);
  };

  const handleViewPlantDetails = (plant: PlantDetails) => {
    setSelectedPlant(plant);
    setCurrentView(AppView.IDENTIFY);
  };

  const renderView = () => {
    if (!user?.isAuthenticated && currentView !== AppView.AUTH) {
      return <AuthView onAuth={handleAuthSuccess} />;
    }

    const isPremium = user?.isPremium || false;

    switch (currentView) {
      case AppView.LANDING: return <LandingView onNavigate={handleNavigate} isPremium={isPremium} />;
      case AppView.IDENTIFY: return (
        <IdentificationView 
          key={selectedPlant?.id || 'new-scan'}
          initialPlant={selectedPlant || undefined}
          onResult={handleIdentificationResult} 
          onAddReminder={(name, task) => {
            handleNavigate(AppView.REMINDERS);
          }}
          onNavigate={handleNavigate}
        />
      );
      case AppView.DIAGNOSE: 
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <DiagnosisView onResult={handleDiagnosisResult} />;
      case AppView.GARDEN:
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <GardenView 
          garden={garden} 
          onRemove={removeFromGarden} 
          onUpdatePlant={handleUpdatePlant} 
          onNavigate={handleNavigate}
          onViewDetails={handleViewPlantDetails}
        />;
      case AppView.MAP: 
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <MapView />;
      case AppView.REMINDERS:
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <RemindersView reminders={reminders} garden={garden} onAdd={addReminder} onDelete={deleteReminder} />;
      case AppView.UPGRADE: return <UpgradeView isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case AppView.ACCOUNT: 
        if (!user) return null;
        return <AccountView user={user} gardenCount={garden.length} reminderCount={reminders.length} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case AppView.AUTH: return <AuthView onAuth={handleAuthSuccess} />;
      default: return <LandingView onNavigate={handleNavigate} isPremium={isPremium} />;
    }
  };

  return (
    <div className="flex h-screen bg-smoke text-slate-800 overflow-hidden relative">
      {user?.isAuthenticated && !hasDismissedNotification && (
        <NotificationOverlay 
          reminders={reminders} 
          onDismiss={() => setHasDismissedNotification(true)}
          onViewReminders={() => {
            setHasDismissedNotification(true);
            handleNavigate(AppView.REMINDERS);
          }}
        />
      )}

      {/* API Key Modal Overlay */}
      {isApiKeyMissing && user?.isAuthenticated && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full text-center shadow-2xl border border-white/20 scale-in duration-300">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">AI Access Required</h3>
            <p className="text-slate-500 font-semibold mb-8 leading-relaxed">To provide advanced botanical identification and diagnostics, you must configure your Gemini API credentials.</p>
            <div className="space-y-4">
              <button 
                onClick={handleOpenApiKeyDialog}
                className="w-full bg-botanist text-white font-black py-5 rounded-full shadow-xl shadow-botanist/20 hover:bg-botanist-dark transition-all active:scale-95 text-lg"
              >
                Configure API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-botanist transition-colors"
              >
                View Billing Documentation
              </a>
            </div>
          </div>
        </div>
      )}

      {user?.isAuthenticated && (
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          isPremium={user.isPremium}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={currentView} 
          onToggleSidebar={() => setSidebarOpen(true)} 
          isAuthenticated={!!user?.isAuthenticated}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 lg:pb-8">
          <div className="max-w-5xl mx-auto">
            {renderView()}
          </div>
        </main>

        {user?.isAuthenticated && (
          <BottomBar 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            isPremium={user.isPremium}
          />
        )}
      </div>
    </div>
  );
};

export default App;

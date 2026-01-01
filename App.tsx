
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
import NotificationOverlay from './components/NotificationOverlay';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [garden, setGarden] = useState<PlantDetails[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [hasDismissedNotification, setHasDismissedNotification] = useState(false);

  // Initialize Auth, Garden & Reminders
  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session);
    
    const savedGarden = localStorage.getItem('flora_garden');
    if (savedGarden) setGarden(JSON.parse(savedGarden));

    const savedReminders = localStorage.getItem('flora_reminders');
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

  const handleIdentificationResult = (plant: PlantDetails, imageUrl: string) => {
    // Add to garden collection
    addToGarden({ ...plant, imageUrl });
  };

  const handleDiagnosisResult = (diagnosis: Diagnosis, imageUrl: string) => {
    // Diagnostics are no longer saved to a history list, they are viewed once.
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

  const renderView = () => {
    if (!user?.isAuthenticated && currentView !== AppView.AUTH) {
      return <AuthView onAuth={handleAuthSuccess} />;
    }

    const isPremium = user?.isPremium || false;

    switch (currentView) {
      case AppView.LANDING: return <LandingView onNavigate={setCurrentView} isPremium={isPremium} />;
      case AppView.IDENTIFY: return (
        <IdentificationView 
          onResult={handleIdentificationResult} 
          onAddReminder={(name, task) => {
            setCurrentView(AppView.REMINDERS);
          }}
        />
      );
      case AppView.DIAGNOSE: 
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <DiagnosisView onResult={handleDiagnosisResult} />;
      case AppView.GARDEN:
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <GardenView garden={garden} onRemove={removeFromGarden} onUpdatePlant={handleUpdatePlant} onNavigate={setCurrentView} />;
      case AppView.MAP: 
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <MapView />;
      case AppView.REMINDERS:
        if (!isPremium) return <UpgradeView isPremium={false} onUpgrade={handleUpgrade} />;
        return <RemindersView reminders={reminders} garden={garden} onAdd={addReminder} onDelete={deleteReminder} />;
      case AppView.UPGRADE: return <UpgradeView isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case AppView.AUTH: return <AuthView onAuth={handleAuthSuccess} />;
      default: return <LandingView onNavigate={setCurrentView} isPremium={isPremium} />;
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
            setCurrentView(AppView.REMINDERS);
          }}
        />
      )}

      {user?.isAuthenticated && (
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
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
          onNavigate={setCurrentView}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 lg:pb-8">
          <div className="max-w-5xl mx-auto">
            {renderView()}
          </div>
        </main>

        {user?.isAuthenticated && (
          <BottomBar 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            isPremium={user.isPremium}
          />
        )}
      </div>
    </div>
  );
};

export default App;

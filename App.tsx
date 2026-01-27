
import React, { useState, useEffect } from 'react';
import { UserState, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StressModule from './components/StressModule';
import PlanningModule from './components/PlanningModule';
import TFEModule from './components/TFEModule';
import CourseModule from './components/CourseModule';
import AICoach from './components/AICoach';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState<UserState>({
    stressLevel: 3,
    tasks: [],
    tfe: { title: "", subject: "", milestones: [], notes: "" },
    courses: []
  });

  // Check existing session
  useEffect(() => {
    const saved = localStorage.getItem('zenstudent_user');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser({ email: userData.email });
      setUserState(userData.state);
    }
    setLoading(false);
  }, []);

  const handleAuth = (email: string, state: UserState) => {
    setUser({ email });
    setUserState(state);
    localStorage.setItem('zenstudent_user', JSON.stringify({ email, state }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zenstudent_user');
  };

  const saveState = async (newState: UserState) => {
    setUserState(newState);
    if (user) {
      localStorage.setItem('zenstudent_user', JSON.stringify({ email: user.email, state: newState }));
      // Sync with backend (JSON CRUD)
      try {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, state: newState })
        });
      } catch (err) {
        console.warn("Désynchronisé du serveur");
      }
    }
  };

  if (loading) return null;
  if (!user) return <Auth onAuth={handleAuth} />;

  const renderContent = () => {
    return (
      <div key={activeTab} className="animate-fade-in">
        {(() => {
          switch(activeTab) {
            case 'dashboard': return <Dashboard state={userState} />;
            case 'stress': return <StressModule state={userState} onUpdate={(val) => saveState({...userState, stressLevel: val})} />;
            case 'planning': return <PlanningModule tasks={userState.tasks} onUpdate={(tasks) => saveState({...userState, tasks})} />;
            case 'tfe': return <TFEModule tfe={userState.tfe} onUpdate={(tfe) => saveState({...userState, tfe})} />;
            case 'courses': return <CourseModule courses={userState.courses} onUpdate={(courses) => saveState({...userState, courses})} />;
            default: return <Dashboard state={userState} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-jakarta">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-5 left-5 z-50 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-slate-800"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto p-5 md:p-10 pt-20 md:pt-10 transition-all duration-300">
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
          {renderContent()}
        </div>
      </main>

      <AICoach context={`Utilisateur: ${user.email}, Stress: ${userState.stressLevel}/10, Tâches: ${userState.tasks.length}`} />
    </div>
  );
};

export default App;

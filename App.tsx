
import React, { useState, useEffect } from 'react';
import { UserState, Task, Course } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StressModule from './components/StressModule';
import PlanningModule from './components/PlanningModule';
import TFEModule from './components/TFEModule';
import CourseModule from './components/CourseModule';
import AICoach from './components/AICoach';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    stressLevel: 3,
    tasks: [
      { id: '1', title: 'Réviser l\'examen d\'économie', deadline: '2023-10-25', priority: 'haute', completed: false },
      { id: '2', title: 'Rédiger introduction TFE', deadline: '2023-11-01', priority: 'moyenne', completed: false },
    ],
    tfe: {
      title: "Impact de l'IA sur l'éducation",
      subject: "Sciences de l'éducation",
      milestones: [
        { id: 'm1', label: 'Choix du sujet', status: 'completed', deadline: '2023-09-15' },
        { id: 'm2', label: 'Recherche bibliographique', status: 'in-progress', deadline: '2023-10-30' },
        { id: 'm3', label: 'Collecte de données', status: 'pending', deadline: '2023-12-15' },
      ],
      notes: ""
    },
    courses: [
      { id: 'c1', name: 'Microéconomie', description: 'Principes fondamentaux', notes: 'L\'offre et la demande sont les piliers...' },
      { id: 'c2', name: 'Statistiques', description: 'Analyses quantitatives', notes: '' }
    ]
  });

  // Local Storage persistence (mock)
  useEffect(() => {
    const saved = localStorage.getItem('zenstudent_state');
    if (saved) {
      try {
        setUserState(JSON.parse(saved));
      } catch(e) { console.error("Could not load state", e); }
    }
  }, []);

  const saveState = (newState: UserState) => {
    setUserState(newState);
    localStorage.setItem('zenstudent_state', JSON.stringify(newState));
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard state={userState} />;
      case 'stress': return <StressModule state={userState} onUpdate={(val) => saveState({...userState, stressLevel: val})} />;
      case 'planning': return <PlanningModule tasks={userState.tasks} onUpdate={(tasks) => saveState({...userState, tasks})} />;
      case 'tfe': return <TFEModule tfe={userState.tfe} onUpdate={(tfe) => saveState({...userState, tfe})} />;
      case 'courses': return <CourseModule courses={userState.courses} onUpdate={(courses) => saveState({...userState, courses})} />;
      default: return <Dashboard state={userState} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto space-y-8">
          {renderContent()}
        </div>
      </main>

      <AICoach context={`Niveau de stress: ${userState.stressLevel}/10, Tâches: ${userState.tasks.length}`} />
    </div>
  );
};

export default App;

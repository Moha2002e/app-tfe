
import React from 'react';
import { UserState } from '../types';

interface DashboardProps {
  state: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const tfeProgress = Math.round(
    (state.tfe.milestones.filter(m => m.status === 'completed').length / state.tfe.milestones.length) * 100
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Bonjour !</h2>
        <p className="text-slate-500 mt-1">Voici un aperçu de ta journée académique.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stress Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">NIVEAU DE STRESS</span>
            <i className="fas fa-heartbeat text-rose-500 text-xl"></i>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-800">{state.stressLevel}/10</div>
            <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${state.stressLevel > 7 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${state.stressLevel * 10}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Pense à prendre une pause si nécessaire.</p>
        </div>

        {/* Tasks Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">TÂCHES À FAIRE</span>
            <i className="fas fa-check-circle text-indigo-500 text-xl"></i>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-800">{state.tasks.length - completedTasks}</div>
            <p className="text-sm text-slate-600 mt-1">Restantes sur {state.tasks.length}</p>
          </div>
          <button className="text-indigo-600 font-semibold text-sm mt-4 hover:underline text-left">
            Voir le planning →
          </button>
        </div>

        {/* TFE Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">AVANCEMENT TFE</span>
            <i className="fas fa-rocket text-amber-500 text-xl"></i>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-800">{tfeProgress}%</div>
            <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${tfeProgress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Prochaine étape: Recherche bibliographique</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-bold mb-3">Besoin d'un coup de pouce ?</h3>
          <p className="text-indigo-100 mb-6">L'assistant IA ZenStudent peut t'aider à structurer ton TFE ou à résumer tes cours en un clic.</p>
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors">
            Parler à l'assistant
          </button>
        </div>
        <i className="fas fa-magic absolute right-[-20px] bottom-[-20px] text-[150px] text-white/10 rotate-12"></i>
      </div>
    </div>
  );
};

export default Dashboard;

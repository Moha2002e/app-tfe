
import React from 'react';
import { TFEProject, TFEMilestone } from '../types';

interface TFEModuleProps {
  tfe: TFEProject;
  onUpdate: (tfe: TFEProject) => void;
}

const TFEModule: React.FC<TFEModuleProps> = ({ tfe, onUpdate }) => {
  const toggleMilestone = (id: string) => {
    const newMilestones = tfe.milestones.map(m => {
      if (m.id === id) {
        const nextStatus: TFEMilestone['status'] = m.status === 'completed' ? 'pending' : m.status === 'pending' ? 'in-progress' : 'completed';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    onUpdate({ ...tfe, milestones: newMilestones });
  };

  const progress = Math.round(
    (tfe.milestones.filter(m => m.status === 'completed').length / tfe.milestones.length) * 100
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Projet TFE</h2>
          <p className="text-slate-500">Travail de Fin d'Études • {tfe.subject}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{progress}%</div>
          <div className="text-xs text-slate-400 font-bold uppercase">Progression totale</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Milestones Column */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Étapes du projet</h3>
            <button className="text-sm text-indigo-600 font-bold">+ Ajouter une étape</button>
          </div>
          
          <div className="space-y-4">
            {tfe.milestones.map((m) => (
              <div 
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border
                  ${m.status === 'completed' ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-slate-100 hover:border-indigo-200'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center border-2
                  ${m.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}
                `}>
                  {m.status === 'completed' && <i className="fas fa-check text-[10px]"></i>}
                  {m.status === 'in-progress' && <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${m.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {m.label}
                  </h4>
                  <p className="text-xs text-slate-400">Deadline: {m.deadline}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                  ${m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    m.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}
                `}>
                  {m.status === 'completed' ? 'Terminé' : m.status === 'in-progress' ? 'En cours' : 'À faire'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4">Notes & Idées</h3>
            <textarea 
              className="w-full h-32 bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-300 focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Tape tes idées ici..."
              value={tfe.notes}
              onChange={(e) => onUpdate({ ...tfe, notes: e.target.value })}
            ></textarea>
            <button className="mt-4 w-full bg-indigo-600 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500">
              Sauvegarder les notes
            </button>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl">
            <h3 className="font-bold text-indigo-900 mb-2">Conseil IA</h3>
            <p className="text-sm text-indigo-700">"La recherche bibliographique est cruciale. As-tu consulté les bases de données JSTOR ou Google Scholar pour ton sujet ?"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFEModule;

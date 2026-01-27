
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface PlanningModuleProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const PlanningModule: React.FC<PlanningModuleProps> = ({ tasks, onUpdate }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('moyenne');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      deadline: new Date().toISOString().split('T')[0],
      priority: newPriority,
      completed: false
    };
    onUpdate([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'haute': return 'text-rose-600 bg-rose-100';
      case 'moyenne': return 'text-amber-600 bg-amber-100';
      case 'basse': return 'text-emerald-600 bg-emerald-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Planning</h2>
        <p className="text-slate-500">Organise tes journées et ne manque aucune deadline.</p>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <select 
            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Priority)}
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
          <button 
            onClick={addTask}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center py-10 text-slate-400">Aucune tâche pour le moment. Profites-en !</p>
          ) : tasks.map(task => (
            <div key={task.id} className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-slate-50 transition-all">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}
              >
                {task.completed && <i className="fas fa-check text-[10px]"></i>}
              </button>
              <div className="flex-1">
                <h4 className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] font-bold text-slate-400"><i className="far fa-calendar mr-1"></i> {task.deadline}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanningModule;

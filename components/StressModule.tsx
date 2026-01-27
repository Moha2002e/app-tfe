
import React, { useState, useEffect } from 'react';
import { UserState } from '../types';

interface StressModuleProps {
  state: UserState;
  onUpdate: (level: number) => void;
}

const StressModule: React.FC<StressModuleProps> = ({ state, onUpdate }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'retient' | 'expire'>('inspire');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    let timer: any;
    if (isBreathing) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            if (breathingPhase === 'inspire') { setBreathingPhase('retient'); return 4; }
            if (breathingPhase === 'retient') { setBreathingPhase('expire'); return 4; }
            if (breathingPhase === 'expire') { setBreathingPhase('inspire'); return 4; }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCounter(4);
      setBreathingPhase('inspire');
    }
    return () => clearInterval(timer);
  }, [isBreathing, breathingPhase]);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Sérénité</h2>
        <p className="text-slate-500">Gère ton stress avec des outils de relaxation rapides.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breathing Exercise */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Respiration Guidée (4-4-4)</h3>
          
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <div 
              className={`absolute inset-0 bg-indigo-100 rounded-full transition-all duration-1000 opacity-50
                ${isBreathing && breathingPhase === 'inspire' ? 'scale-100' : ''}
                ${isBreathing && breathingPhase === 'expire' ? 'scale-50' : ''}
                ${!isBreathing ? 'scale-75' : ''}
              `}
            ></div>
            <div 
              className={`w-32 h-32 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white font-bold text-2xl transition-all duration-1000
                ${isBreathing && breathingPhase === 'inspire' ? 'scale-110' : 'scale-90'}
              `}
            >
              <span>{counter}s</span>
              <span className="text-xs uppercase tracking-widest mt-1">
                {isBreathing ? (breathingPhase === 'inspire' ? 'Inspire' : breathingPhase === 'retient' ? 'Retient' : 'Expire') : 'Prêt ?'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsBreathing(!isBreathing)}
            className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${isBreathing ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {isBreathing ? 'Arrêter la séance' : 'Commencer (1 min)'}
          </button>
        </div>

        {/* Stress Tracking */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Comment te sens-tu ?</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="1" max="10" 
                value={state.stressLevel}
                onChange={(e) => onUpdate(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>ZEN (1)</span>
                <span>PANIQUE (10)</span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3">
                <i className="fas fa-smile text-xl"></i>
                <span className="text-sm font-semibold">Messages motivants</span>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center gap-3">
                <i className="fas fa-brain text-xl"></i>
                <span className="text-sm font-semibold">Micro-méditation</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-rose-200 text-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bell"></i>
              </div>
              <div>
                <h4 className="font-bold text-rose-800">Alerte Stress Élevé</h4>
                <p className="text-rose-700 text-sm mt-1">Ton niveau de stress actuel (8/10) est supérieur à ta moyenne habituelle. L'assistant te suggère d'écouter une séance audio de 3 min.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressModule;

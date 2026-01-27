
import React, { useState } from 'react';
import { Course } from '../types';
import { summarizeNotes, generateQuiz } from '../services/geminiService';

interface CourseModuleProps {
  courses: Course[];
  onUpdate: (courses: Course[]) => void;
}

const CourseModule: React.FC<CourseModuleProps> = ({ courses, onUpdate }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState<any[]>([]);
  
  // States for adding a new course
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddCourse = () => {
    if (!newName.trim()) return;
    const newCourse: Course = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      notes: ''
    };
    const updatedCourses = [...courses, newCourse];
    onUpdate(updatedCourses);
    setSelectedCourse(newCourse);
    setNewName('');
    setNewDesc('');
    setIsAdding(false);
  };

  const handleDeleteCourse = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Es-tu sûr de vouloir supprimer cette matière ?')) {
      const updated = courses.filter(c => c.id !== id);
      onUpdate(updated);
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setSummary('');
        setQuiz([]);
      }
    }
  };

  const handleSummarize = async () => {
    if (!selectedCourse?.notes) return;
    setLoading(true);
    setSummary('');
    try {
      const result = await summarizeNotes(selectedCourse.notes);
      setSummary(result || "Impossible de résumer.");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleQuiz = async () => {
    if (!selectedCourse?.notes) return;
    setLoading(true);
    setQuiz([]);
    try {
      const result = await generateQuiz(selectedCourse.notes);
      setQuiz(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Mes Cours</h2>
          <p className="text-slate-500">Gère tes matières et révise efficacement avec l'IA.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Nouvelle Matière
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar: Course List & Add Form */}
        <div className="space-y-3">
          {isAdding && (
            <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-md animate-slide-up space-y-3 mb-4">
              <input 
                autoFocus
                type="text" 
                placeholder="Nom du cours (ex: Droit)"
                className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Description courte"
                className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleAddCourse}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700"
                >
                  Créer
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {courses.length === 0 && !isAdding && (
              <p className="text-xs text-slate-400 text-center py-4">Aucune matière ajoutée.</p>
            )}
            {courses.map(course => (
              <div 
                key={course.id}
                onClick={() => { setSelectedCourse(course); setSummary(''); setQuiz([]); setIsAdding(false); }}
                className={`group relative w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${selectedCourse?.id === course.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
              >
                <h4 className="font-bold text-slate-800 pr-6">{course.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{course.description || 'Pas de description'}</p>
                <button 
                  onClick={(e) => handleDeleteCourse(e, course.id)}
                  className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Notes & AI Tools */}
        <div className="md:col-span-3 space-y-6">
          {selectedCourse ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedCourse.name}</h3>
                  <p className="text-slate-500 text-sm">{selectedCourse.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleSummarize}
                    disabled={loading || !selectedCourse.notes}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 disabled:opacity-30 transition-all"
                  >
                    <i className="fas fa-magic"></i> Résumer
                  </button>
                  <button 
                    onClick={handleQuiz}
                    disabled={loading || !selectedCourse.notes}
                    className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 disabled:opacity-30 transition-all"
                  >
                    <i className="fas fa-vial"></i> Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Contenu du cours</label>
                  <textarea 
                    className="w-full h-64 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                    value={selectedCourse.notes}
                    onChange={(e) => {
                      const updated = courses.map(c => c.id === selectedCourse.id ? {...c, notes: e.target.value} : c);
                      onUpdate(updated);
                    }}
                    placeholder="Colle ou saisis tes notes de cours ici pour que l'IA puisse t'aider..."
                  ></textarea>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-pulse">
                    <i className="fas fa-brain animate-bounce text-indigo-500 mr-3 text-xl"></i>
                    <span className="text-sm font-medium text-slate-600">L'IA analyse tes notes...</span>
                  </div>
                )}

                {summary && (
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-slide-up">
                    <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-sparkles text-indigo-600"></i> Points Clés
                    </h4>
                    <div className="text-sm text-indigo-800 leading-relaxed space-y-2 whitespace-pre-wrap">
                      {summary}
                    </div>
                  </div>
                )}

                {quiz.length > 0 && (
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 animate-slide-up">
                    <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-vial text-amber-600"></i> Quiz de Révision
                    </h4>
                    <div className="space-y-6">
                      {quiz.map((q, idx) => (
                        <div key={idx} className="space-y-3 bg-white/50 p-4 rounded-xl">
                          <p className="font-semibold text-amber-800 text-sm">{idx + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt: string, oIdx: number) => (
                              <button 
                                key={oIdx}
                                onClick={() => alert(oIdx === q.answer ? "✅ Bravo ! C'est la bonne réponse." : "❌ Non, essaie encore !")}
                                className="text-left px-4 py-2 bg-white border border-amber-200 rounded-lg text-xs hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-book-open text-3xl text-slate-200"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-600">Aucune matière sélectionnée</h3>
              <p className="max-w-xs mx-auto mt-2">Choisis un cours dans la liste à gauche ou crée-en un nouveau pour commencer à réviser.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModule;

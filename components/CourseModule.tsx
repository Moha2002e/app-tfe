
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

  const handleSummarize = async () => {
    if (!selectedCourse?.notes) return;
    setLoading(true);
    try {
      const result = await summarizeNotes(selectedCourse.notes);
      setSummary(result || "Impossible de résumer.");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleQuiz = async () => {
    if (!selectedCourse?.notes) return;
    setLoading(true);
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
          <p className="text-slate-500">Gère tes matières et révise efficacement.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700">
          + Nouvelle Matière
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-3">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => { setSelectedCourse(course); setSummary(''); setQuiz([]); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedCourse?.id === course.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
            >
              <h4 className="font-bold text-slate-800">{course.name}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.description}</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {selectedCourse ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedCourse.name}</h3>
                  <p className="text-slate-500">{selectedCourse.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSummarize}
                    disabled={loading}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 disabled:opacity-50"
                  >
                    <i className="fas fa-magic"></i> Résumer
                  </button>
                  <button 
                    onClick={handleQuiz}
                    disabled={loading}
                    className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 disabled:opacity-50"
                  >
                    <i className="fas fa-vial"></i> Créer Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Notes de cours</label>
                  <textarea 
                    className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-indigo-500 resize-none"
                    value={selectedCourse.notes}
                    onChange={(e) => {
                      const updated = courses.map(c => c.id === selectedCourse.id ? {...c, notes: e.target.value} : c);
                      onUpdate(updated);
                    }}
                    placeholder="Colle tes notes ici..."
                  ></textarea>
                </div>

                {loading && <div className="text-center py-4"><i className="fas fa-circle-notch animate-spin text-indigo-500 mr-2"></i> Analyse par l'IA...</div>}

                {summary && (
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-slide-up">
                    <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-stars text-indigo-600"></i> Résumé Automatique
                    </h4>
                    <div className="text-sm text-indigo-800 prose prose-indigo max-w-none">
                      {summary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
                )}

                {quiz.length > 0 && (
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 animate-slide-up">
                    <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-vial text-amber-600"></i> Quiz d'Auto-évaluation
                    </h4>
                    <div className="space-y-6">
                      {quiz.map((q, idx) => (
                        <div key={idx} className="space-y-3">
                          <p className="font-semibold text-amber-800 text-sm">{idx + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt: string, oIdx: number) => (
                              <button 
                                key={oIdx}
                                onClick={() => alert(oIdx === q.answer ? "Bonne réponse !" : "Dommage, essaye encore.")}
                                className="text-left px-4 py-2 bg-white border border-amber-200 rounded-lg text-xs hover:bg-amber-100 transition-colors"
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
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <i className="fas fa-book-open text-4xl mb-4"></i>
              <p>Sélectionne une matière pour voir tes notes et outils IA.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModule;

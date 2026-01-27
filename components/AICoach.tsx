
import React, { useState, useRef, useEffect } from 'react';
import { getAICoachingResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AICoachProps {
  context: string;
}

const AICoach: React.FC<AICoachProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Salut ! Je suis ton coach ZenStudent. Comment puis-je t'aider aujourd'hui ? Que ce soit pour ton TFE, un cours ou juste pour souffler." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getAICoachingResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', text: response || "Je n'ai pas pu générer de réponse." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Oups, j'ai eu un petit problème technique." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm">ZenBot Coach</h4>
                <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Assistant IA Actif</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                  ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
                `}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Dis quelque chose..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all animate-pulse"
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      )}
    </div>
  );
};

export default AICoach;

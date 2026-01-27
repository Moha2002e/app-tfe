
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-grid-2' },
    { id: 'stress', label: 'Sérénité', icon: 'fa-spa' },
    { id: 'planning', label: 'Planning', icon: 'fa-calendar-days' },
    { id: 'tfe', label: 'Projet TFE', icon: 'fa-award' },
    { id: 'courses', label: 'Mes Cours', icon: 'fa-book-bookmark' },
  ];

  return (
    <div className={`
      fixed md:relative z-40 h-full w-72 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-8 flex flex-col
      transition-all duration-500 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">ZenStudent</h1>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Premium Académique</span>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all btn-active
              ${activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'}
            `}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
        >
          <i className="fas fa-arrow-right-from-bracket"></i>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-chart-pie' },
    { id: 'stress', label: 'Sérénité', icon: 'fa-leaf' },
    { id: 'planning', label: 'Planning', icon: 'fa-calendar-alt' },
    { id: 'tfe', label: 'Projet TFE', icon: 'fa-graduation-cap' },
    { id: 'courses', label: 'Mes Cours', icon: 'fa-book-open' },
  ];

  return (
    <div className={`
      fixed md:relative z-40 h-full w-64 bg-white border-r border-slate-200 p-6 flex flex-col
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-800">ZenStudent</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
              ${activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Statut Session</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-600">En ligne</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

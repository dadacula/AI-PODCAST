import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  navigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, navigate }) => {
  const navItems: { id: Screen; icon: string; label: string }[] = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'explore', icon: 'search', label: 'Search' },
    { id: 'saved', icon: 'bookmark', label: 'Saved' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[80px] z-40 max-w-[430px] mx-auto">
       <div className="absolute inset-0 bg-background-light/95 dark:bg-[#1a171e]/95 backdrop-blur-md border-t border-primary/5 dark:border-white/5"></div>
       <div className="relative flex justify-around items-center h-full pb-4 px-2">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors group ${
                isActive ? 'text-primary dark:text-white' : 'text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive ? 'icon-filled' : ''}`}>
                {item.icon}
              </span>
              <span 
                className={`text-[10px] font-bold font-sans transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

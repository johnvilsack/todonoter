
import React from 'react';

interface AppBarProps {
  title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[rgb(var(--app-bar-bg-color))] text-[rgb(var(--app-bar-text-color))] shadow-lg flex items-center justify-between px-4 z-50">
      <div className="flex-grow pl-2">
         <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      {/* Theme Toggle Button Removed */}
    </header>
  );
};

export default AppBar;

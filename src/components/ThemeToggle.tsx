import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-in-out
        ${isDark 
          ? 'bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/25' 
          : 'bg-gradient-to-r from-orange-200/80 via-yellow-200/80 to-amber-200/80 backdrop-blur-xl border border-orange-300/30 shadow-lg shadow-orange-300/25'
        }
        hover:scale-105 hover:shadow-xl
        ${isDark ? 'hover:shadow-purple-500/40' : 'hover:shadow-orange-300/40'}
        group overflow-hidden
      `}
    >
      {/* Animated background glow */}
      <div className={`
        absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isDark 
          ? 'bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20' 
          : 'bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-amber-400/20'
        }
        animate-pulse
      `} />
      
      {/* Sliding toggle */}
      <div className={`
        relative w-6 h-6 rounded-full transition-all duration-500 ease-in-out transform
        ${isDark ? 'translate-x-8' : 'translate-x-0'}
        ${isDark 
          ? 'bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 shadow-lg shadow-purple-400/50' 
          : 'bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 shadow-lg shadow-orange-400/50'
        }
        flex items-center justify-center
        group-hover:scale-110
      `}>
        {/* Shining effect */}
        <div className={`
          absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
          ${isDark 
            ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-white/50 to-transparent'
          }
          animate-ping
        `} />
        
        {/* Icon */}
        <div className="relative z-10">
          {isDark ? (
            <Moon className="w-3 h-3 text-white drop-shadow-sm" />
          ) : (
            <Sun className="w-3 h-3 text-white drop-shadow-sm" />
          )}
        </div>
      </div>
      
      {/* Sparkle effects */}
      <div className={`
        absolute top-1 right-2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100
        ${isDark ? 'bg-purple-300' : 'bg-orange-300'}
        animate-ping animation-delay-100
      `} />
      <div className={`
        absolute bottom-1 left-2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100
        ${isDark ? 'bg-blue-300' : 'bg-yellow-300'}
        animate-ping animation-delay-300
      `} />
    </button>
  );
};

export default ThemeToggle;
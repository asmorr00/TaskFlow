'use client'


import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-[#1E1E1E] border border-slate-200/60 dark:border-slate-700/50 
                 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out
                 hover:border-slate-300/60 dark:hover:border-slate-600/50 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun className={`
          absolute inset-0 w-5 h-5 text-slate-600 dark:text-slate-400 transition-all duration-200 ease-in-out
          ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
        `} />
        <Moon className={`
          absolute inset-0 w-5 h-5 text-slate-600 dark:text-slate-400 transition-all duration-200 ease-in-out
          ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
        `} />
      </div>
    </button>
  )
}
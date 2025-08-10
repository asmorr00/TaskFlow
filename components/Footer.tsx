


import { DarkModeToggle } from './DarkModeToggle'

export function Footer() {
  return (
    <footer className="w-full bg-[#F9FAFB] dark:bg-[#0A0A0A] px-6 py-4 border-t border-slate-200/60 dark:border-slate-700/50">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
          Task Management System
        </p>
        <DarkModeToggle />
      </div>
    </footer>
  )
}
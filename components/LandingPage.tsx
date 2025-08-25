'use client'

import { CheckCircle, Eye, Grid3X3, Zap, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const features = [
    {
      icon: <Grid3X3 className="w-6 h-6" />,
      title: "Dynamic Grid & List Views",
      description: "Switch between grid and list layouts to match your workflow. Responsive design adapts to any screen size."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Drag & Drop",
      description: "Intuitive drag-and-drop reordering. Organize your tasks exactly how you want them with smooth animations."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Focus Mode",
      description: "Eliminate distractions with focus mode. Highlight specific tasks and blur out the rest for better concentration."
    }
  ]

  return (
    <div className="light min-h-screen bg-[#F9FAFB] font-[Inter,system-ui,sans-serif]">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">
              Floatier
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onSignIn}
              className="text-slate-700 hover:text-slate-900"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 leading-tight tracking-tight">
            Organize your work
            <br />
            <span className="text-blue-600">and life, today.</span>
          </h1>
          {/*
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Become focused, organized, and calm with Floatier. The world's #1 task manager and to-do list app for getting things done.
          </p>
          }
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 text-base"
            >
              Start organizing today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={onSignIn}
              size="lg"
              className="border-slate-300 dark:border-slate-600 px-8 py-3 text-base"
            >
              Sign In
            </Button>
          </div>
          */}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
            The modern task management system
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Designed to help you stay organized and focused on what matters most. 
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      {/*<section className="bg-white dark:bg-[#1E1E1E] border-y border-slate-200/60 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2">50M+</div>
              <div className="text-slate-600 dark:text-slate-400">Tasks completed</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2">15M+</div>
              <div className="text-slate-600 dark:text-slate-400">Happy users</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
              <div className="text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-slate-900 mb-8 tracking-tight">
            Get Floatier
          </h2>
          {/*<p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Stay organized and focused on what matters most. 
          </p>*/}
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 text-base"
          >
            Start free trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/*<div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Floatier</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Floatier helps you stay organized and focused on what matters most.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Focus Mode</li>
                <li>Drag & Drop</li>
                <li>Grid & List Views</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>About</li>
                <li>Contact</li>
                <li>Status</li>
                <li>Privacy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Help Center</li>
                <li>Status</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>*/}
          
          <div className="text-center">
            <p className="text-sm text-slate-600">
              © 2025 Floatier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

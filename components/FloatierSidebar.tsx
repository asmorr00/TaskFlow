'use client'

import React from 'react'
import { 
  ChevronRight, 
  ChevronLeft,
  //Home, 
  CheckSquare, 
  //FolderOpen, 
  //Users, 
  //BarChart3, 
  Settings, 
  ChevronDown,
  //BookOpen,
  LogOut,
  //Clock
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useAuth } from '../src/components/AuthProvider'

// Navigation data structure for Floatier
const navigationItems = {
  workspace: [
    /*{ 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: Home, 
      badge: null 
    },*/
    { 
      id: 'tasks', 
      title: 'Tasks', 
      icon: CheckSquare, 
      badge: null 
    },
    /*{ 
      id: 'projects', 
      title: 'Projects', 
      icon: FolderOpen, 
      badge: null 
    },*/
    /*{ 
      id: 'timeline', 
      title: 'Timeline', 
      icon: Clock, 
      badge: null 
    },*/
  ],

  /*build: [
    { 
      id: 'build', 
      title: 'Build', 
      icon: FolderOpen, 
      badge: null 
    },
    /*{ 
      id: 'build2', 
      title: 'Build2', 
      icon: FolderOpen, 
      badge: null 
    },
    {
      id: 'build3', 
      title: 'Build3', 
      icon: FolderOpen, 
      badge: null 
    },
  ],*/
  // Removed settings section since it's now in the profile menu
}

interface FloatierSidebarProps {
  currentSection: string
  onSectionChange: (section: string) => void
  onOpenSettings: () => void
  onSignOut: () => void
  defaultOpen?: boolean
  children?: React.ReactNode
}

function UserProfileMenu({ onOpenSettings, onSignOut }: { onOpenSettings: () => void, onSignOut: () => void }) {
  const { user } = useAuth()
  
  // Get user display name and initials
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User'
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full justify-start gap-3 h-12 px-3 text-left hover:bg-gray-200/50 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-gray-300">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-600 text-white text-sm">
            {getInitials(userDisplayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-gray-900 text-sm truncate">{userDisplayName}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserProfileMenuCollapsed({ onOpenSettings, onSignOut }: { onOpenSettings: () => void, onSignOut: () => void }) {
  const { user } = useAuth()
  
  // Get user display name and initials
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User'
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center justify-center p-2 rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {getInitials(userDisplayName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function FloatierSidebar({ 
  currentSection,
  onSectionChange,
  onOpenSettings,
  onSignOut,
  defaultOpen = true,
  children 
}: FloatierSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultOpen)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-300 transition-all duration-300 ease-in-out flex flex-col ${
        isExpanded ? 'w-64' : 'w-16'
      }`}>
        {/* Header */}
        <div className="border-b border-gray-300 p-3">
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 flex items-center justify-center">
                
                </div>
                <h1 className="text-gray-900 font-semibold text-lg tracking-wide">
                  Floatier
                </h1>
              </div>
            ) : (
              <div className="w-2 h-2 flex items-center justify-center">
               
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isExpanded ? (
            <div className="flex-1 overflow-auto">
              {/* WORKSPACE Section */}
              <div className="p-4">
                {/*<div className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-3">
                  WORKSPACE
                </div>*/}
                <div className="space-y-1">
                  {navigationItems.workspace.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        currentSection === item.id 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs bg-gray-200 text-gray-700">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed state - icons only */
            <div className="flex-1 overflow-auto p-2 space-y-2">
              {/* Chevron button positioned inline with nav items */}
              {/*<button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center p-3 rounded-md transition-colors text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>*/}
              
              {/* Tasks icons */}
              {navigationItems.workspace.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                    currentSection === item.id 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.title}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {/* Footer - moved inside content div to stick to bottom */}
          <div className="border-t border-gray-300 p-2">
            {isExpanded ? (
              <>
                {/* Help & Support */}
                {/*<button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100 mb-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Help & Support</span>
                </button>*/}
                
                {/* User Profile */}
                <UserProfileMenu onOpenSettings={onOpenSettings} onSignOut={onSignOut} />
              </>
            ) : (
              <div className="space-y-2">
                {/* Help icon */}
                {/*<button 
                  className="w-full flex items-center justify-center p-3 rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  title="Help & Support"
                >
                  <BookOpen className="h-4 w-4" />
                </button>*/}
                
                {/* User avatar */}
                <UserProfileMenuCollapsed onOpenSettings={onOpenSettings} onSignOut={onSignOut} />
              </div>
            )}
          </div>
        </div>

        {/* Footer - REMOVED from here */}
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
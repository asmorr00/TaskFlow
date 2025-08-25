'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, LogOut, Edit3, Camera, Check, X, User, Shield, Eye, EyeOff, Sun, Monitor, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'


import { useAuth } from '../src/components/AuthProvider'
import { useTheme } from './ThemeProvider'

interface SettingsPageProps {
  onBackToApp: () => void
  onSignOut: () => void
}

export function SettingsPage({ onBackToApp, onSignOut }: SettingsPageProps) {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
    title: user?.user_metadata?.title || 'Team Member'
  })
  const [editData, setEditData] = useState(profileData)
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  


  // Update profile data when user changes
  useEffect(() => {
    setProfileData({
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      avatar: user?.user_metadata?.avatar_url || '',
      title: user?.user_metadata?.title || 'Team Member'
    })
  }, [user])


  const handleSaveProfile = () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }



  const handlePasswordSubmit = () => {
    // TODO: Implement password update logic
    console.log('Password update submitted:', passwordForm)
    // Reset form after successful update
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }



  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] font-[Inter,system-ui,sans-serif]">
      {/* Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToApp}
                className="
                  inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 
                  hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200
                  px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
                "
              >
                <ArrowLeft className="w-4 h-4" />
                Back to workspace
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={onSignOut}
                className="gap-2"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`
                  w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-left flex items-center gap-2
                  ${activeTab === 'profile' 
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`
                  w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-left flex items-center gap-2
                  ${activeTab === 'privacy' 
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <Shield className="w-4 h-4" />
                Privacy & Security
              </button>
            </div>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
            <>
            <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div>
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and profile information.
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </Button>
                  )}
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={isEditing ? editData.name : profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="bg-slate-50 dark:bg-slate-800 disabled:opacity-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={isEditing ? editData.title : profileData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={!isEditing}
                      className="bg-slate-50 dark:bg-slate-800 disabled:opacity-100"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editData.email : profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="bg-slate-50 dark:bg-slate-800 disabled:opacity-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>
                  Choose whether the Console's appearance should be light, dark, or use your computer's settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Color mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Light Mode */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="text-sm font-medium">Light</span>
                    </button>

                    {/* System Mode */}
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 ${
                        theme === 'system'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
                      }`}
                    >
                      <Monitor className="w-5 h-5" />
                      <span className="text-sm font-medium">System</span>
                    </button>

                    {/* Dark Mode */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Password & Authentication</CardTitle>
                  <CardDescription>
                    Manage your password and authentication methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handlePasswordSubmit} className="bg-blue-600 hover:bg-blue-700">
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

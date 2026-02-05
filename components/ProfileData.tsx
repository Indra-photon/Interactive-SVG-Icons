'use client';

import React from 'react'
import { useUserStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, User, IdCard, Shield } from 'lucide-react'

function ProfileData() {
  const user = useUserStore((state) => state.user);

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-neutral-500">No user data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card with Avatar */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-neutral-100 shadow-md">
                <AvatarImage src={user.avatar} alt={user.name || 'User'} />
                <AvatarFallback className="bg-neutral-200 text-neutral-700 text-2xl font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <CardTitle className="text-3xl font-bold text-neutral-900">
                    {user.name || 'User'}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 w-fit mx-auto sm:mx-0">
                    Active
                  </Badge>
                </div>
                <CardDescription className="text-neutral-600 text-base">
                  Member Profile
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information Card */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">
              Profile Information
            </CardTitle>
            <CardDescription className="text-neutral-600">
              Your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Full Name */}
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-neutral-100">
                <User className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-neutral-500">Full Name</p>
                <p className="text-base font-semibold text-neutral-900">
                  {user.name || 'Not provided'}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-200" />

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-neutral-100">
                <Mail className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-neutral-500">Email Address</p>
                <p className="text-base font-semibold text-neutral-900 break-all">
                  {user.email || 'Not provided'}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-200" />

            {/* User ID */}
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-neutral-100">
                <IdCard className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-neutral-500">User ID</p>
                <p className="text-base font-mono text-neutral-700 break-all">
                  {user.id || 'Not provided'}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card className="border-neutral-200 shadow-sm bg-neutral-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-neutral-600" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-neutral-600">Your account is active and verified</p>
                <p className="text-xs text-neutral-500">All features are available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default ProfileData
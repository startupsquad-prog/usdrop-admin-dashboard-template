"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@/types/user"
import { getUserAvatarUrl, getInitials } from "@/lib/avatar"
import { Shield, Crown, User as UserIcon, Calendar, Mail, Edit, Activity, Key } from "lucide-react"

interface UserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onEdit: () => void
}

export function UserDetailsModal({
  open,
  onOpenChange,
  user,
  onEdit,
}: UserDetailsModalProps) {
  if (!user) return null

  const avatarUrl = getUserAvatarUrl(user)
  const initials = getInitials(user.full_name, user.email)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Shield className="size-4" />
      case 'admin': return <Crown className="size-4" />
      default: return <UserIcon className="size-4" />
    }
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default' as const
      case 'admin': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  const getPlanVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'default' as const
      case 'pro': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  <img 
                    src={avatarUrl} 
                    alt={`${user.full_name || user.email} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-medium">${initials}</span>`
                      }
                    }}
                  />
                </div>
                {user.full_name || 'No name'}
              </DialogTitle>
              <DialogDescription>
                Complete user profile and activity information
              </DialogDescription>
            </div>
            <Button onClick={onEdit} size="sm">
              <Edit className="size-4 mr-2" />
              Edit User
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Account Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <div className="mt-1">
                        <Badge variant={getRoleVariant(user.role_id)} className="flex items-center gap-1 w-fit">
                          {getRoleIcon(user.role_id)}
                          {user.role_id}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Plan:</span>
                      <div className="mt-1">
                        <Badge variant={getPlanVariant(user.plan)} className="w-fit">
                          {user.plan}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Activity className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Account created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Activity className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Profile last updated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Access Permissions</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Key className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Role Permissions</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role_id === 'owner' && 'Full system access and management capabilities'}
                      {user.role_id === 'admin' && 'Administrative access to user management and system settings'}
                      {user.role_id === 'client' && 'Standard user access to personal features'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Key className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Plan Features</p>
                    <p className="text-xs text-muted-foreground">
                      {user.plan === 'enterprise' && 'All features including advanced analytics and priority support'}
                      {user.plan === 'pro' && 'Advanced features with enhanced storage and support'}
                      {user.plan === 'free' && 'Basic features with limited storage and standard support'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

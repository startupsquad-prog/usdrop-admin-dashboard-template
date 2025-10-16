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
import { User } from "@/types/user"
import { getUserAvatarUrl, getInitials } from "@/lib/avatar"
import { Shield, Crown, User as UserIcon, Calendar, Mail } from "lucide-react"

interface UserQuickViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onViewFullProfile: () => void
}

export function UserQuickViewModal({
  open,
  onOpenChange,
  user,
  onViewFullProfile,
}: UserQuickViewModalProps) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Quick overview of user information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              <img 
                src={avatarUrl} 
                alt={`${user.full_name || user.email} avatar`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<span class="text-lg font-medium">${initials}</span>`
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.full_name || 'No name'}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                {user.email}
              </div>
            </div>
          </div>

          {/* Role and Plan */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant={getRoleVariant(user.role_id)} className="flex items-center gap-1">
                {getRoleIcon(user.role_id)}
                {user.role_id}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Plan:</span>
              <Badge variant={getPlanVariant(user.plan)}>
                {user.plan}
              </Badge>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button onClick={onViewFullProfile} className="w-full">
              View Full Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

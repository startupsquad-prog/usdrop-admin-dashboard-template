"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Edit, Eye, Trash2, Shield, Crown, User } from "lucide-react"

interface User {
  id: string
  full_name: string
  role_id: string
  plan: string
  created_at: string
  updated_at: string
  email?: string
}

interface Plan {
  id: string
  name: string
  description: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    role_id: '',
    plan: ''
  })
  
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    fetchUsers()
    fetchPlans()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Unauthorized access')
          return
        }
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plan')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      toast.error('Failed to fetch plans')
      console.error('Error fetching plans:', error)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      full_name: user.full_name || '',
      role_id: user.role_id,
      plan: user.plan
    })
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('profile')
        .update({
          full_name: editForm.full_name,
          role_id: editForm.role_id,
          plan: editForm.plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) throw error

      toast.success('User updated successfully!')
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user')
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('profile')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast.success('User deleted successfully!')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Shield className="size-4" />
      case 'admin': return <Crown className="size-4" />
      default: return <User className="size-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'default'
      case 'admin': return 'secondary'
      default: return 'outline'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'default'
      case 'pro': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts, roles, and subscription plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.full_name?.charAt(0) || user.id.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email || 'No email'}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={getRoleColor(user.role_id)} className="flex items-center gap-1">
                  {getRoleIcon(user.role_id)}
                  {user.role_id}
                </Badge>
                <Badge variant={getPlanColor(user.plan)}>
                  {user.plan}
                </Badge>
                
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                          Update user information, role, and plan
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role_id">Role</Label>
                          <Select value={editForm.role_id} onValueChange={(value) => setEditForm({ ...editForm, role_id: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="plan">Plan</Label>
                          <Select value={editForm.plan} onValueChange={(value) => setEditForm({ ...editForm, plan: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} - {plan.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="size-4 mr-1" />
                    View
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

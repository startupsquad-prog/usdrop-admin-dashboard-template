"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdminBreadcrumb } from "@/components/admin-breadcrumb"
import { UsersDataTable } from "@/components/admin/users-data-table"
import { QuickLogin } from "@/components/quick-login"

export default function UsersPage() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Quick Login for Testing */}
      <QuickLogin />
      
      {/* Header */}
      <header className="border-b border-border flex-shrink-0">
        <div className="flex items-center gap-4 px-4 py-4">
          <SidebarTrigger />
          <div className="flex-1">
            <AdminBreadcrumb />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users in your system
          </p>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <UsersDataTable />
        </div>
      </main>
    </div>
  )
}

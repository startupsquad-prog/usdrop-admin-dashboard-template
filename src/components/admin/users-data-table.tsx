"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "./data-table/data-table"
import { createColumns } from "./data-table/columns"
import { User, UserTableResponse } from "@/types/user"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddUserDialog } from "./add-user-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { UserQuickViewModal } from "./user-quick-view-modal"
import { UserDetailsModal } from "./user-details-modal"

interface UsersDataTableProps {
  activeFilter?: string
}

export function UsersDataTable({ activeFilter = "all" }: UsersDataTableProps) {
  const [data, setData] = useState<User[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [view, setView] = useState("table")
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  
  // Query state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState([])
  const [filters, setFilters] = useState([])
  const [search, setSearch] = useState("")

  const fetchUsers = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true)
    } else {
      setLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        ...(sorting[0] && {
          sortBy: sorting[0].id,
          sortOrder: sorting[0].desc ? 'desc' : 'asc',
        }),
      })

      // Add filter params
      filters.forEach((filter) => {
        if (filter.value && filter.value.length > 0) {
          params.append(filter.id, filter.value.join(','))
        }
      })

      // Add active filter from tabs
      if (activeFilter !== "all") {
        if (activeFilter === "admins") {
          params.append("role", "admin")
        } else {
          params.append("plan", activeFilter)
        }
      }

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Unauthorized access')
          return
        }
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const result: UserTableResponse = await response.json()
      
      setData(result.users)
      setPageCount(result.pagination.totalPages)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [page, pageSize, sorting, filters, search])

  useEffect(() => {
    fetchUsers(true) // Initial load
  }, [])

  // Separate effect for subsequent fetches (sorting, filtering, pagination)
  useEffect(() => {
    if (!initialLoading) {
      fetchUsers(false)
    }
  }, [page, pageSize, sorting, filters, search, activeFilter])

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleSortingChange = (newSorting: any) => {
    setSorting(newSorting)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  const handleViewChange = (newView: string) => {
    setView(newView)
  }

  const handleAddUser = () => {
    setAddUserOpen(true)
  }

  const handleUserAdded = () => {
    // Refresh the data after user is added
    fetchUsers(false)
  }


  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/admin/users/delete?userId=${userToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      toast.success('User deleted successfully')
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      
      // Refresh data after deletion
      fetchUsers(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user')
      console.error('Error deleting user:', error)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setQuickViewOpen(true)
  }

  const handleViewFullProfile = () => {
    setQuickViewOpen(false)
    setDetailsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setDetailsModalOpen(true)
  }

  // Create columns with the callbacks
  const columns = createColumns(handleViewUser, handleEditUser, handleDeleteUser)

  const handleDateRangeChange = (newDateRange: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(newDateRange)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user role')
      }

      toast.success('User role updated successfully')
      // Refresh data after role change
      fetchUsers(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user role')
      console.error('Error updating role:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          loading={loading}
          initialLoading={initialLoading}
          view={view}
          onViewChange={handleViewChange}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onViewUser={handleViewUser}
          onDateRangeChange={handleDateRangeChange}
          onRoleChange={handleRoleChange}
        />
      </div>
      
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onUserAdded={handleUserAdded}
      />
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This will permanently remove their account and all associated data."
        userName={userToDelete?.full_name || userToDelete?.email}
      />
      
      <UserQuickViewModal
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        user={selectedUser}
        onViewFullProfile={handleViewFullProfile}
      />
      
      <UserDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        user={selectedUser}
        onEdit={() => {
          // TODO: Implement edit functionality
          toast.info('Edit functionality coming soon')
        }}
      />
    </div>
  )
}

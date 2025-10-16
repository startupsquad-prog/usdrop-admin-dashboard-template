export interface User {
  id: string
  full_name: string
  email: string
  role_id: 'client' | 'admin' | 'owner'
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface UserTableResponse {
  users: User[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
  }
}

export interface UserFilters {
  search?: string
  role?: string
  plan?: string
}

export interface UserSorting {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface UserPagination {
  page: number
  pageSize: number
}

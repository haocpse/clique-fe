// API response/request type definitions

export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

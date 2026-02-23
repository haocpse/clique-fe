// API response/request type definitions

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code: number;
  errors?: Record<string, string[]>;
}

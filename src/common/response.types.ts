// response.types.ts
export interface ErrorDetail {
  field?: string | null;
  code?: string | null; // optional machine code
  message: string;
}

export interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: MetaPagination | null;
  errors?: ErrorDetail[] | null;
}

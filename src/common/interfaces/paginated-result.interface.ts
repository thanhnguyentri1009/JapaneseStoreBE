export interface PaginatedResult<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}

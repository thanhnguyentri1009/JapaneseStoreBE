export interface PaginatedResult<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
}

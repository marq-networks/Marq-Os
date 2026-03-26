import type { PaginatedResponse } from '../../../../src/app/services/types';

export function parsePageParams(query: any) {
  const page = Math.max(1, Number(query?.page ?? 1) || 1);
  const pageSize = Math.min(500, Math.max(1, Number(query?.pageSize ?? 50) || 50));
  const search = typeof query?.search === 'string' ? query.search : undefined;
  return { page, pageSize, search };
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total, page, pageSize, hasMore: start + pageSize < total };
}


import { Request } from 'express';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

interface PaginationQuery {
  page?: string;
  limit?: string;
  all?: string;
}

interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
  all: boolean;
}

export function getPagination(
  query: PaginationQuery
): PaginationResult {
  const page = parseInt(query.page || String(DEFAULT_PAGE), 10);
  const limit = parseInt(query.limit || String(DEFAULT_LIMIT), 10);
  const all = query.all === 'true';

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    all,
  };
}

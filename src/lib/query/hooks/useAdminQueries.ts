import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { MOCK_QUERIES } from "@/data/mock/admin";
import type { Query } from "@/types";

/** Enquiry as returned by `GET /api/queries`. */
export type ApiQuery = {
  _id?: string;
  id?: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  requirement: string;
  message?: string;
  status: string;
  createdAt?: string;
};

export function toQuery(q: ApiQuery): Query {
  return {
    id: q._id ?? q.id ?? "",
    name: q.fullName,
    mobile: q.mobileNumber,
    email: q.email,
    city: q.city,
    requirement: q.requirement,
    message: q.message,
    status: q.status,
    date: q.createdAt ? q.createdAt.slice(0, 10) : "",
  };
}

/**
 * Loads inbound sales enquiries for the admin dashboard (`GET /api/queries`).
 * Falls back to mock data if the request fails, so the dashboard still renders
 * during local development without the API.
 */
export function useAdminQueries() {
  return useQuery({
    queryKey: queryKeys.adminQueries,
    queryFn: async (): Promise<Query[]> => {
      try {
        const { data } = await apiGetPaged<ApiQuery>(`${endpoints.queries}?limit=100`);
        return data.map(toQuery);
      } catch {
        return MOCK_QUERIES;
      }
    },
  });
}

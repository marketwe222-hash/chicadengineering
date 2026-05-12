"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import type { Student } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await api.get<T>(url);
  if (res.error) throw new Error(res.error);
  return res.data as T;
}

export function useStudents(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  const key = `/api/students?${searchParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Student>>(
    key,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );

  return {
    students: data?.data ?? [],
    pagination: data?.pagination ?? {
      page: params.page,
      pageSize: params.pageSize,
      total: 0,
      totalPages: 1,
    },
    isLoading,
    error: error instanceof Error ? error.message : null,
    mutate,
  };
}

export function useAllStudents() {
  const key = "/api/students?pageSize=1000";

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Student>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );

  return {
    allStudents: data?.data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    mutate,
  };
}

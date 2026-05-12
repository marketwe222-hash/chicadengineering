"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Course } from "@/types";
import type { PaginatedResponse } from "@/types";

export function useCourses(params?: {
  page?: number;
  search?: string;
  status?: string;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);

    const res = await api.get<PaginatedResponse<Course>>(
      `/api/courses?${query}`,
    );

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setCourses(res.data.data);
      setPagination(res.data.pagination);
    }

    setIsLoading(false);
  }, [params?.page, params?.search, params?.status]);

  useEffect(() => {
    load();
  }, [load]);

  return { courses, pagination, isLoading, error, refetch: load };
}

export function useCourse(courseId: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      setIsLoading(true);
      const res = await api.get<{ data: Course }>(`/api/courses/${courseId}`);
      if (res.error) setError(res.error);
      else setCourse(res.data?.data ?? null);
      setIsLoading(false);
    };

    load();
  }, [courseId]);

  return { course, isLoading, error };
}

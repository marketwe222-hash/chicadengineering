"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";

const CACHE_TTL_MS = 1000 * 60 * 20; // 20 minutes
const STORAGE_PREFIX = "academy-gallery-cache";

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
  category?: string | null;
  altText?: string | null;
  description?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type GalleryApiItemRaw = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  altText: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

interface GalleryApiResponseRaw {
  data: GalleryApiItemRaw[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface GalleryApiResponse {
  data: GalleryItem[];
  pagination: GalleryApiResponseRaw["pagination"];
}

function fetcher<T>(url: string): Promise<T> {
  return api.get<T>(url).then((res) => {
    if (res.error) {
      throw new Error(res.error);
    }
    return res.data as T;
  });
}

function mapGalleryItem(item: GalleryApiItemRaw): GalleryItem {
  return {
    id: item.id,
    title: item.title,
    src: item.imageUrl?.trim() || "",
    category: item.category || undefined,
    altText: item.altText || undefined,
    description: item.description || undefined,
    order: item.order,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function mapGalleryResponse(raw: GalleryApiResponseRaw): GalleryApiResponse {
  return {
    data: raw.data.map(mapGalleryItem).filter((item) => item.src),
    pagination: raw.pagination,
  };
}

function getCacheKey(key: string) {
  return `${STORAGE_PREFIX}:${encodeURIComponent(key)}`;
}

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getCacheKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      window.localStorage.removeItem(getCacheKey(key));
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getCacheKey(key),
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // ignore storage write errors
  }
}

export function useGallery(params: {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
}) {
  const query = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("pageSize", String(params.pageSize));
    if (params.search) searchParams.set("search", params.search.trim());
    if (params.category && params.category !== "All") {
      searchParams.set("category", params.category.trim());
    }
    return `/api/gallery?${searchParams.toString()}`;
  }, [params.page, params.pageSize, params.search, params.category]);

  const [fallbackData, setFallbackData] = useState<GalleryApiResponse | undefined>();

  useEffect(() => {
    const cached = readCache<GalleryApiResponse>(query);
    if (cached) {
      setFallbackData(cached);
    }
  }, [query]);

  const { data, error, isLoading, mutate } = useSWR<GalleryApiResponse>(
    query,
    async (url) => mapGalleryResponse(await fetcher<GalleryApiResponseRaw>(url)),
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      onSuccess: (response) => {
        if (response) writeCache(query, response);
      },
    },
  );

  return {
    gallery: data?.data ?? [],
    pagination: data?.pagination ?? {
      page: params.page,
      pageSize: params.pageSize,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    isLoading,
    error: error instanceof Error ? error.message : null,
    mutate,
  };
}

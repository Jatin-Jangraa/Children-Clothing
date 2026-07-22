import axios from "axios";
import type { ApiResponse, ProductFilters } from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const productQueries = {
  getAll: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    const { data } = await api.get<ApiResponse<any>>(`/products?${params.toString()}`);
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/products?slug=${slug}`);
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/products/${id}`);
    return data;
  },
  create: async (product: any) => {
    const { data } = await api.post<ApiResponse<any>>("/products", product);
    return data;
  },
  update: async (id: string, product: any) => {
    const { data } = await api.put<ApiResponse<any>>(`/products/${id}`, product);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<any>>(`/products/${id}`);
    return data;
  },
};

export const categoryQueries = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<any>>("/categories");
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/categories?slug=${slug}`);
    return data;
  },
  create: async (category: any) => {
    const { data } = await api.post<ApiResponse<any>>("/categories", category);
    return data;
  },
  update: async (id: string, category: any) => {
    const { data } = await api.put<ApiResponse<any>>(`/categories/${id}`, category);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<any>>(`/categories/${id}`);
    return data;
  },
};

export const orderQueries = {
  getAll: async (page = 1, limit = 20) => {
    const { data } = await api.get<ApiResponse<any>>(`/orders?page=${page}&limit=${limit}`);
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/orders/${id}`);
    return data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch<ApiResponse<any>>(`/orders/${id}`, { orderStatus: status });
    return data;
  },
};

export const couponQueries = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<any>>("/coupons");
    return data;
  },
  validate: async (code: string, total: number) => {
    const { data } = await api.post<ApiResponse<any>>("/coupons", { code, total });
    return data;
  },
  create: async (coupon: any) => {
    const { data } = await api.post<ApiResponse<any>>("/coupons", coupon);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<any>>(`/coupons/${id}`);
    return data;
  },
};

export const bannerQueries = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<any>>("/banners");
    return data;
  },
  create: async (banner: any) => {
    const { data } = await api.post<ApiResponse<any>>("/banners", banner);
    return data;
  },
  update: async (id: string, banner: any) => {
    const { data } = await api.put<ApiResponse<any>>(`/banners/${id}`, banner);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<any>>(`/banners/${id}`);
    return data;
  },
};

export const reviewQueries = {
  getByProduct: async (productId: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/reviews?product=${productId}`);
    return data;
  },
  create: async (review: any) => {
    const { data } = await api.post<ApiResponse<any>>("/reviews", review);
    return data;
  },
  approve: async (id: string) => {
    const { data } = await api.patch<ApiResponse<any>>(`/reviews/${id}`, { isApproved: true });
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<any>>(`/reviews/${id}`);
    return data;
  },
};

export const searchQuery = async (q: string) => {
  const { data } = await api.get<ApiResponse<any>>(`/search?q=${encodeURIComponent(q)}`);
  return data;
};

export const settingsQuery = {
  get: async () => {
    const { data } = await api.get<ApiResponse<any>>("/settings");
    return data;
  },
  update: async (settings: any) => {
    const { data } = await api.put<ApiResponse<any>>("/settings", settings);
    return data;
  },
};

export const analyticsQuery = {
  get: async (period?: string) => {
    const { data } = await api.get<ApiResponse<any>>(`/analytics${period ? `?period=${period}` : ""}`);
    return data;
  },
};

export const subscriberQuery = {
  subscribe: async (email: string) => {
    const { data } = await api.post<ApiResponse<any>>("/subscribers", { email });
    return data;
  },
};

export default api;

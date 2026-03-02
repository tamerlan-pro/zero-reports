import type { DataProvider } from '@refinedev/core';
import { axiosInstance } from './axios';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const params: Record<string, unknown> = {};

    // Пагинация
    if (pagination) {
      const { current, pageSize } = pagination as { current?: number; pageSize?: number };
      params._page = current ?? 1;
      params._limit = pageSize ?? 10;
    }

    // Фильтры
    filters?.forEach((filter) => {
      if ('field' in filter) {
        params[filter.field] = filter.value;
      }
    });

    // Сортировка
    if (sorters && sorters.length > 0) {
      params._sort = sorters.map((s) => s.field).join(',');
      params._order = sorters.map((s) => s.order).join(',');
    }

    const { data, headers } = await axiosInstance.get(`/${resource}`, { params });

    const total = Number(headers['x-total-count']) || data.length;

    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.get(`/${resource}/${id}`);
    return { data };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(`/${resource}`, variables);
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axiosInstance.patch(`/${resource}/${id}`, variables);
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.delete(`/${resource}/${id}`);
    return { data };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await axiosInstance.get(`/${resource}`, {
      params: { id: ids },
    });
    return { data };
  },

  getApiUrl: () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  },
};

export default dataProvider;

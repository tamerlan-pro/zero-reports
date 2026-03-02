import type { AuthProvider } from '@refinedev/core';
import { axiosInstance } from './axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  tenantName: string;
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      return {
        success: false,
        error: {
          name: 'LoginError',
          message,
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      const { role } = JSON.parse(user) as User;
      return role;
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
      };
    }
    return { error };
  },
};

export default authProvider;

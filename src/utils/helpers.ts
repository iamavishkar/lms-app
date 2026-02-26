import { TOKEN_KEY, USER_KEY } from './constants';
import { User } from '../interfaces';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
export const setStoredUser = (user: User): void =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = (): void => localStorage.removeItem(USER_KEY);

export const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const err = error as { data?: { message?: string }; message?: string };
    return err.data?.message || err.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

export const calculateGrade = (obtained: number, total: number): string => {
  const percentage = (obtained / total) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

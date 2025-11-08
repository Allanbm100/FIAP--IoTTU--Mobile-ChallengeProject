import axios from 'axios';
import i18n from '../i18n';

const API_URL = "http://10.0.2.2:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email_usuario: string;
  senha_usuario: string;
}

export interface LoginResponse {
  id_usuario: number;
  nome_usuario: string;
  email_usuario: string;
  role: string;
  message: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials);
  
  if (!response.data || !response.data.id_usuario) {
    throw new Error('VALIDATION_ERROR');
  }
  
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: any) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getYards = async (userId?: number) => {
  const params = userId ? { userId } : {};
  const response = await api.get('/yards', { params });
  return response.data;
};

export const getYardById = async (id: number) => {
  const response = await api.get(`/yards/${id}`);
  return response.data;
};

export const createYard = async (yard: any) => {
  const response = await api.post('/yards', yard);
  return response.data;
};

export const updateYard = async (id: number, yard: any) => {
  const response = await api.put(`/yards/${id}`, yard);
  return response.data;
};

export const deleteYard = async (id: number) => {
  const response = await api.delete(`/yards/${id}`);
  return response.data;
};

export const getMotorcycles = async (userId?: number) => {
  const params = userId ? { userId } : {};
  const response = await api.get('/motorcycles', { params });
  return response.data;
};

export const getMotorcycleById = async (id: number) => {
  const response = await api.get(`/motorcycles/${id}`);
  return response.data;
};

export const createMotorcycle = async (motorcycle: any) => {
  const response = await api.post('/motorcycles', motorcycle);
  return response.data;
};

export const updateMotorcycle = async (id: number, motorcycle: any) => {
  const response = await api.put(`/motorcycles/${id}`, motorcycle);
  return response.data;
};

export const deleteMotorcycle = async (id: number) => {
  const response = await api.delete(`/motorcycles/${id}`);
  return response.data;
};

export const getAntennas = async (userId?: number) => {
  const params = userId ? { userId } : {};
  const response = await api.get('/antennas', { params });
  return response.data;
};

export const getAntennaById = async (id: number) => {
  const response = await api.get(`/antennas/${id}`);
  return response.data;
};

export const createAntenna = async (antenna: any) => {
  const response = await api.post('/antennas', antenna);
  return response.data;
};

export const updateAntenna = async (id: number, antenna: any) => {
  const response = await api.put(`/antennas/${id}`, antenna);
  return response.data;
};

export const deleteAntenna = async (id: number) => {
  const response = await api.delete(`/antennas/${id}`);
  return response.data;
};

export const getTags = async (userId?: number) => {
  const params = userId ? { userId } : {};
  const response = await api.get('/tags', { params });
  return response.data;
};

export const getTagById = async (id: number) => {
  const response = await api.get(`/tags/${id}`);
  return response.data;
};

export const createTag = async (tag: any) => {
  const response = await api.post('/tags', tag);
  return response.data;
};

export const updateTag = async (id: number, tag: any) => {
  const response = await api.put(`/tags/${id}`, tag);
  return response.data;
};

export const deleteTag = async (id: number) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

export const getMotorcycleStatuses = async () => {
  const response = await api.get('/motorcycle-statuses');
  return response.data;
};

export type ApiConstraint = 'FOREIGN_KEY' | 'UNIQUE' | 'NOT_FOUND' | 'UNKNOWN';
export interface ApiErrorInfo {
  status?: number;
  message: string;
  constraint?: ApiConstraint;
}

export const parseApiError = (error: any): ApiErrorInfo => {
  const status = error?.response?.status as number | undefined;
  const data = error?.response?.data;
  const serverMessage = typeof data === 'string' ? data : (data?.detail || data?.message || '');
  const raw = (serverMessage || '').toString().toLowerCase();

  let constraint: ApiConstraint | undefined = undefined;
  if (status === 409 || raw.includes('foreign key') || raw.includes('integrity') || raw.includes('constraint')) {
    constraint = 'FOREIGN_KEY';
  } else if (status === 404 || raw.includes('not found')) {
    constraint = 'NOT_FOUND';
  } else if (raw.includes('unique')) {
    constraint = 'UNIQUE';
  } else if (status && status >= 400) {
    constraint = 'UNKNOWN';
  }

  return {
    status,
    message: serverMessage || error?.message || i18n.t('validation.unknownError'),
    constraint,
  };
};

export default api;

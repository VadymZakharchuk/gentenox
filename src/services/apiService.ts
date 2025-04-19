import api from './axios'
import { DialogsResponse, MessagesResponse, Profile } from "@/types/app.types";

const API_BASE_URL = '/api'; // Або ваша базова URL-адреса API

// Отримання профілю користувача за ID
export const getProfile = async (id: string): Promise<Profile> => {
  try {
    console.log('id', id)
    const response = await api.get(`/profiles/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error('Помилка отримання профілю:', error.message);
    throw error;
  }
};

// Отримання списку діалогів
export const getDialogs = async (
  offset: number = 0,
  limit: number = 10,
  participantId: string | null = null): Promise<DialogsResponse> => {
  try {
    const params: Record<string, any> = { offset, limit };
    if (participantId) {
      params.participantId = participantId;
    }
    const response = await api.get(`/dialogs`, { params });
    return response.data;
  } catch (error: any) {
    console.error('Помилка отримання діалогів:', error.message);
    throw error;
  }
};

// Отримання повідомлень для конкретного діалогу
export const getMessages = async (
  dialogId: string,
  offset: number = 0,
  limit: number = 10): Promise<MessagesResponse> => {
  try {
    const params = { offset, limit };
    const response = await api.get(`/dialogs/${dialogId}/messages`, { params });
    return response.data;
  } catch (error: any) {
    console.error(`Помилка отримання повідомлень для діалогу ${dialogId}:`, error.message);
    throw error;
  }
};
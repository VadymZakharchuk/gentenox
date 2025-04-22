import api from './axios'
import { DialogsResponse, MessagesResponse, Profile } from "@/types/app.types";

// Отримання профілю користувача за ID
export const getProfile = async (id: string): Promise<Profile> => {
  try {
    const response = await api.get(`/profiles/${id}`);
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

// Завантаження файлів на сервер
export const uploadFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', file); // Припустимо, що серверний ендпоінт очікує поле 'image'

  try {
    const response = await fetch('/api/upload/image', { // тут повинен бути фактичний ендпоінт завантаження зображень
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl; // Припустимо, що сервер повинен повертати URL у полі imageUrl
    } else {
      console.error('Помилка завантаження файлу:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Помилка завантаження файлу:', error);
    return null;
  }
};
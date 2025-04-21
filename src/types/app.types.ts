export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface MessagePayload {
  id: string;
  dialogId: string;
  senderId: string;
  createdAt: number;
  type: 'text' | 'image' | 'video';
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  fileUrl? : string;
  fileName?: string;
}

export interface Message {
  type: 'NEW_MESSAGE' | "NEW_DIALOG";
  payload: MessagePayload;
}

export interface DialogItem {
  id: string;
  participantIds: string[];
  lastMessage: Message;
  updatedAt: number;
}

export interface DialogsResponse {
  items: DialogItem[];
  total: number;
  offset: number;
  hasMore: boolean;
}

export interface MessagesResponse {
  items: Message[];
  total: number;
  offset: number;
  hasMore: boolean;
}

<template>
  <div class="home-page">
    <div class="home-page__header">
      <h1 class="text-xl text-blue-900 font-bold">Vue 3 chat client application</h1>
    </div>
    <div class="home-page__body">
      <Sidebar @select-dialog="loadMessages"
               :dialogs="dialogsData.items"
               :participants="userParticipants"
               :total-dialogs="dialogsData.total"
               :has-more-dialogs="dialogsData.hasMore"
               @load-more-dialogs="loadMoreDialogs"
               :user-profile="userProfile" />
      <ChatWindow :messages="messagesData.items"
                  :participants="userParticipants"
                  :total-messages="messagesData.total"
                  :has-more-messages="messagesData.hasMore"
                  @load-more-messages="loadMoreMessages"
                  @send-message="sendMessage"
                  :current-dialog-id="currentDialogId"
                  :user-profile="userProfile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getDialogs, getMessages, getProfile} from '@/services/apiService';
import Sidebar from '@/components/side-bar/Sidebar.vue';
import ChatWindow from '@/components/chat-window/ChatWindow.vue';
import {DialogsResponse, Message, MessagePayload, MessagesResponse, Profile} from "@/types/app.types";
import { useUserStore } from "@/store/user";

// Типи даних на основі API
const userProfile = ref<Profile | null>(null);
const userParticipants = ref<Profile[]>([]);
const dialogsData = ref<DialogsResponse>({ items: [], total: 0, offset: 0, hasMore: false });
const messagesData = ref<MessagesResponse>({ items: [], total: 0, offset: 0, hasMore: false });
const currentDialogId = ref<string | null>(null);
const userId = ref<string>('user1');

const userState = useUserStore()
const loadUserProfile = async () => {
  try {
    const storedUserId = userState.user.id;
    if (!storedUserId) {
      userState.user = await getProfile(userId.value);
      userId.value = userState.user.id;
    }
    userProfile.value = userState.user
  } catch (error) {
    console.error('Profile download error', error);
  }
};

const loadDialogs = async (offset = 0, limit = 10, participantId: string | null = null) => {
  try {
    const response = await getDialogs(offset, limit, participantId);
    dialogsData.value.items = [...dialogsData.value.items, ...response.items];
    for (const item of dialogsData.value.items) {

      for (const uId of item.participantIds) {
        if( userParticipants.value && userParticipants.value.some(up => up.id === uId)) continue
        const res = await getProfile(uId);
        if (res) {
          userParticipants.value.push(res)
        }
      }
    }

    dialogsData.value.total = response.total;
    dialogsData.value.offset = response.offset + response.items.length;
    dialogsData.value.hasMore = response.hasMore;
  } catch (error) {
    console.error('Dialog download error', error);
  }
};

const loadMoreDialogs = async () => {
  if (dialogsData.value.hasMore) {
    await loadDialogs(dialogsData.value.offset);
  }
};

const loadMessages = async (dialogId: string) => {
  currentDialogId.value = dialogId;
  messagesData.value = { items: [], total: 0, offset: 0, hasMore: false };
  await loadMoreMessages();
};

const loadMoreMessages = async (offset = messagesData.value.offset, limit = 10) => {
  if (currentDialogId.value) {
    try {
      const response = await getMessages(currentDialogId.value, offset, limit);
      messagesData.value.items = [...messagesData.value.items, ...response.items];
      messagesData.value.total = response.total;
      messagesData.value.offset = response.offset + response.items.length;
      messagesData.value.hasMore = response.hasMore;
    } catch (error) {
      console.error(`Dialog messages download error ${currentDialogId.value}`, error);
    }
  }
};

const sendMessage = (messagePayload: MessagePayload) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN && currentDialogId.value) {
      const message: Message = {
        type: 'NEW_MESSAGE',
        payload: messagePayload
      };
      socket.value.send(JSON.stringify(message));
      messagesData.value.items.push(message);
    }
  }
;

const socket = ref<WebSocket | null>(null);
const serverUrl = import.meta.env.VITE_CHAT_URL
const reconnectInterval = 3000;
const connectionError = ref<string>('');

const connectWebSocket = () => {
  connectionError.value = '';
  socket.value = new WebSocket(serverUrl);

  socket.value.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  socket.value.onmessage = (event: MessageEvent) => {
    try {
      const data: Message = JSON.parse(event.data as string);
      if (data.type === 'NEW_MESSAGE' && data.payload.dialogId === currentDialogId.value) {
        messagesData.value.items.push(data);
      } else if (data.type === 'NEW_DIALOG') {
        // Обробка нового діалогу (може знадобитися оновлення списку діалогів)
        loadDialogs(); // Або більш ефективне оновлення
      }
    } catch (error) {
      console.error('websocket message handling WebSocket:', error);
    }
  };

  socket.value.onclose = () => {
    console.log('Disconnected from WebSocket server. Attempting to reconnect via ' + reconnectInterval / 1000 + ' secs...');
    setTimeout(connectWebSocket, reconnectInterval);
  };

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error);
    connectionError.value = 'Server connection error.';
  };
};

onMounted(async () => {
  await loadUserProfile();
  await loadDialogs(0, 10, userId.value);
  connectWebSocket();
});
</script>

<style scoped lang="scss">
.home-page {
  @apply flex flex-col h-screen;

  &__header {
    @apply bg-gray-100 border-b border-gray-200 p-4;
    &-h1 {
      @apply text-xl font-semibold text-gray-800;
    }
  }

  &__body {
    @apply flex flex-grow overflow-hidden;
  }
}
</style>
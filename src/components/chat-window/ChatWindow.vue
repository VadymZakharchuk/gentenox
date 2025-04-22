<template>
  <div class="chat">
    <ChatArea :messages="messages"
              :participants="participants"
              :hasMoreMessages="hasMoreMessages"
              :userProfileId="userProfile?.id"
              @load-more-messages="$emit('load-more-messages')" />
    <ChatInputArea v-if="receiverId"
                   :currentDialogId="currentDialogId"
                   :userProfileId="userProfile?.id"
                   :receiverId="receiverId"
                   @send-message="handleSendMessage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Profile, Message, MessagePayload } from "@/types/app.types";
import ChatArea from '@/components/chat-area/ChatArea.vue';
import ChatInputArea from '@/components/chat-input-area/ChatInputArea.vue';

const props = defineProps<{
  messages: Message[];
  participants: Profile[];
  totalMessages: number;
  hasMoreMessages: boolean;
  currentDialogId: string | null;
  userProfile: Profile | null;
}>();

const emit = defineEmits(['load-more-messages', 'send-message']);
const receiverId = computed(() => props.messages[0] ? props.messages[0].payload.id : null);

const handleSendMessage = (payload: MessagePayload ) => {
  emit('send-message', payload);
};
</script>

<style scoped lang="scss">
.chat {
  @apply flex flex-col flex-grow bg-white shadow-md overflow-hidden;
}
</style>
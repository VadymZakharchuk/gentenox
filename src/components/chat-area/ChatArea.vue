<template>
  <div class="chat-area scrollbar">
    <ChatMessage v-for="message in messages"
                 :key="message.payload.id"
                 :message="message"
                 :participants="participants"
                 :userProfileId="userProfileId" />
    <div v-if="hasMoreMessages" class="chat-hasMore">
      <button @click="emit('load-more-messages')"
              class="chat-hasMore__btn">
        Load more messages
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatMessage from '@/components/chat-message/ChatMessage.vue';
import { Profile, Message } from "@/types/app.types";

defineProps<{
  messages: Message[];
  participants: Profile[];
  hasMoreMessages: boolean;
  userProfileId: string | null | undefined;
}>();

const emit = defineEmits(['load-more-messages']);
</script>

<style scoped lang="scss">
.chat-area {
  @apply flex-grow overflow-y-auto p-4 flex flex-col space-y-2;
}

.chat-hasMore {
  @apply mt-4 flex justify-center;
  &__btn {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded;
  }
}
</style>
<template>
  <div class="chat">
    <div class="chat-area scrollbar">
      <div v-for="message in messages"
           :key="message.payload.id"
           class="chat-message"
           :class="{
             'bg-blue-500 text-white self-end': message.payload.senderId === userProfile?.id,
             'bg-gray-200 text-gray-800 self-start': message.payload.senderId !== userProfile?.id}">
        <span class="font-semibold mr-2">{{ getSenderName(message.payload.senderId) }}:</span>
        <span v-if="message.payload.type === 'text'">{{ message.payload.content }}</span>
        <img v-else-if="message.payload.type === 'image'"
             :src="message.payload.imageUrl"
             alt="Image"
             class="max-w-full h-auto">
        <video v-else-if="message.payload.type === 'video'"
               :src="message.payload.videoUrl"
               controls
               class="max-w-full h-auto">
        </video>
      </div>
      <div v-if="hasMoreMessages" class="chat-hasMore">
        <button @click="$emit('load-more-messages')"
                class="chat-hasMore__btn">
          Load more messages
        </button>
      </div>
    </div>
    <div class="chat-inputArea">
      <div class="flex">
        <input
          type="text"
          v-model="newMessageText"
          @keyup.enter="handleSendMessage"
          placeholder="Enter message..."
          class="chat-inputArea__input"
        />
        <button
          @click="handleSendMessage"
          class="chat-inputArea__btn"
        >
          Надіслати
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Profile, Message} from "@/types/app.types"

const props = defineProps<{
  messages: Message[];
  totalMessages: number;
  hasMoreMessages: boolean;
  currentDialogId: string | null;
  userProfile: Profile | null;
}>();

const emit = defineEmits(['load-more-messages', 'send-message']);

const newMessageText = ref('');

const handleSendMessage = () => {
  if (newMessageText.value.trim()) {
    emit('send-message', newMessageText.value.trim());
    newMessageText.value = '';
  }
};

const getSenderName = (senderId: string) => {
  // У реальному застосунку тут потрібно буде підтягувати ім'я користувача за ID
  if (props.userProfile?.id === senderId) {
    return props.userProfile.name;
  }
  return `Користувач ${senderId.substring(0, 8)}...`;
};
</script>

<style scoped lang="scss">
.chat {
  @apply flex flex-col flex-grow bg-white shadow-md overflow-hidden;

  &-area {
    @apply flex-grow overflow-y-auto p-4 flex flex-col space-y-2;
  }
  &-message {
    @apply rounded-lg p-3 max-w-[66%] break-words;
  }
  &-hasMore {
    @apply mt-4 flex justify-center;
    &__btn {
      @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded;
    }
  }
  &-inputArea {
    @apply p-4 border-t border-gray-200;

    &__input {
      @apply bg-blue-500 text-white rounded-r-md px-4 py-2 font-semibold hover:bg-blue-600;
      @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
    }
    &__btn {
      @apply ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded;
    }
  }
}

</style>
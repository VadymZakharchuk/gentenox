<template>
  <div class="chat">
    <div class="chat-area scrollbar">
      <div v-for="message in messages"
           :key="message.payload.id"
           class="chat-message"
           :class="{
             'bg-blue-500 text-white self-end': message.payload.senderId === userProfile?.id,
             'bg-gray-200 text-gray-800 self-start': message.payload.senderId !== userProfile?.id}">
        <div class="flex justify-start items-center mb-2">
          <img  v-if="senderAvatar(message.payload.senderId)"
                :src="senderAvatar(message.payload.senderId)"
                alt="avatar"
          class="w-10 h-10 rounded-full mr-2"/>
          <span class="font-semibold mr-2">{{ senderName(message.payload.senderId) }}:</span>
        </div>

        <span v-if="message.payload.type === 'text'"
              class="max-w-[50%] break-words">
          {{ message.payload.content }}
        </span>
        <img v-else-if="message.payload.type === 'image'"
             :src="message.payload.imageUrl"
             alt="Image"
             class="max-w-full h-auto">
        <video v-else-if="message.payload.type === 'video'"
               :src="message.payload.videoUrl"
               controls
               class="max-w-full h-auto">
        </video>
        <div class= "text-[12px] text-right mt-2"
             :class="{
              'text-gray-300': message.payload.senderId === userProfile?.id,
              'text-gray-600': message.payload.senderId !== userProfile?.id
              }">
          {{new Date(message.payload.createdAt).toLocaleString('en-Uk') }}
        </div>
      </div>
      <div v-if="hasMoreMessages" class="chat-hasMore">
        <button @click="$emit('load-more-messages')"
                class="chat-hasMore__btn">
          Load more messages
        </button>
      </div>
    </div>
    <div class="chat-inputArea">
      <div class="flex justify-center">
        <input
          type="text"
          v-model="newMessageText"
          @keyup.enter="handleSendMessage"
          placeholder="Enter message..."
          class="chat-inputArea__input"
        />
        <button
          @click="handleSendMessage()"
          class="chat-inputArea__btn"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Profile, Message} from "@/types/app.types"

const props = defineProps<{
  messages: Message[];
  participants: Profile[];
  totalMessages: number;
  hasMoreMessages: boolean;
  currentDialogId: string | null;
  userProfile: Profile | null;
}>();

const emit = defineEmits(['load-more-messages', 'send-message']);
const newMessageText = ref('');
const receiverId = computed(() => props.participants[0].id)
const handleSendMessage = () => {
  if (newMessageText.value.trim()) {
    emit('send-message', newMessageText.value.trim(), receiverId.value);
    newMessageText.value = '';
  }
}
const senderName = (senderId: string) => {
  const res = props.participants.filter(item => item.id === senderId);
  if (res.length > 0) {
    return res[0].name;
  }
  return props.userProfile ? props.userProfile.name : 'anonymous';
};
const senderAvatar = (senderId: string) => {
  const res = props.participants.filter(item => item.id === senderId);
  if (res.length > 0) {
    return res[0].avatar;
  }
  return props.userProfile ? props.userProfile.avatar : undefined;
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
      @apply bg-blue-200 text-black rounded-r-md px-4 py-2 font-medium hover:bg-blue-400;
      @apply w-4/5 focus:outline-none focus:ring-2 focus:ring-blue-500;
    }
    &__btn {
      @apply ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold;
      @apply w-1/5 py-2 px-4 rounded;
    }
  }
}

</style>
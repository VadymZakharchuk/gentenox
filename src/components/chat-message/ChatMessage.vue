<template>
  <div class="chat-message"
       :class="{
         'bg-blue-500 text-white self-end': message.payload.senderId === userProfileId,
         'bg-gray-200 text-gray-800 self-start': message.payload.senderId !== userProfileId}">
    <div class="flex justify-start items-center mb-2">
      <img v-if="senderAvatar"
           :src="senderAvatar"
           alt="avatar"
           class="w-10 h-10 rounded-full mr-2"/>
      <span class="font-semibold mr-2">{{ senderName }}:</span>
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
    <div class="text-[12px] text-right mt-2"
         :class="{
          'text-gray-300': message.payload.senderId === userProfileId,
          'text-gray-600': message.payload.senderId !== userProfileId
          }">
      {{ formatDate(message.payload.createdAt) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Profile, Message } from "@/types/app.types";
import { formatDate } from "@/utils/formatDate";
import { computed } from "vue";

const props = defineProps<{
  message: Message;
  participants: Profile[];
  userProfileId: string | null | undefined;
}>();

const senderName = computed(() => {
  const sender = props.participants.find(p => p.id === props.message.payload.senderId);
  return sender ? sender.name : 'anonymous';
});

const senderAvatar = computed(() => {
  const sender = props.participants.find(p => p.id === props.message.payload.senderId);
  return sender ? sender.avatar : undefined;
});
</script>

<style scoped lang="scss">
.chat-message {
  @apply rounded-lg p-3 max-w-[66%] break-words;
}
</style>
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
        <div>
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileSelect"
            accept="image/*, video/*, application/*"
            multiple
          />
          <button @click="$refs.fileInput.click()" class="chat-inputArea__attach">
            <svg width="28px" height="28px" viewBox="0 0 28 28"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                <title>attachment 2</title> <desc>Created with Sketch Beta.</desc> <defs> </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                  <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-260.000000, -156.000000)" fill="#000000">
                    <path d="M286.562,166.181 L272.325,180.26 C269.966,182.593 266.141,182.593 263.782,180.26 C261.423,177.928 261.423,174.146 263.782,171.813 L276.596,159.141 C278.168,157.586 280.718,157.586 282.291,159.141 C283.863,160.696 283.863,163.218 282.291,164.772 L269.477,177.444 C268.691,178.222 267.416,178.222 266.629,177.444 C265.843,176.667 265.843,175.406 266.629,174.628 L278.02,163.365 L276.596,161.957 L265.206,173.221 C263.633,174.775 263.633,177.297 265.206,178.853 C266.778,180.407 269.328,180.407 270.901,178.852 L283.714,166.181 C286.073,163.849 286.074,160.065 283.715,157.733 C281.355,155.4 277.531,155.4 275.172,157.733 L261.646,171.108 L261.696,171.157 C259.238,174.281 259.455,178.797 262.358,181.668 C265.262,184.539 269.828,184.754 272.987,182.323 L273.036,182.372 L287.986,167.589 L286.562,166.181" id="attachment-2" sketch:type="MSShapeGroup">
              </path> </g> </g> </g>
            </svg>
          </button>
        </div>
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
import {Profile, Message, MessagePayload} from "@/types/app.types"

const props = defineProps<{
  messages: Message[];
  participants: Profile[];
  totalMessages: number;
  hasMoreMessages: boolean;
  currentDialogId: string | null;
  userProfile: Profile | null;
}>();

const emit = defineEmits(['load-more-messages', 'send-message']);
const fileInput = ref<HTMLInputElement | null>(null)
const newMessageText = ref('');
const receiverId = computed(() => props.participants[0].id)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleSendMessage = (file?: File) => {
  if (newMessageText.value.trim() || file) {
    const type = file
      ? file.type.startsWith('image/')
        ? 'image'
        : 'video'
      : 'text';

    const payload: MessagePayload = {
      id: receiverId.value,
      dialogId: props.currentDialogId || '',
      senderId: props.userProfile?.id || '',
      createdAt: Date.now(),
      type: type,
    };

    if (type === 'text') {
      payload.content = newMessageText.value.trim();
    } else if (file) {
      const tempUrl = URL.createObjectURL(file);
      if (type === 'image') {
        payload.imageUrl = tempUrl;
      } else if (type === 'video') {
        payload.videoUrl = tempUrl;
      } else if (type === 'file') {
        payload.fileUrl = tempUrl;
        payload.fileName = file.name;
      }
    }

    emit('send-message', payload);
    newMessageText.value = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    // Оскільки ми дозволяємо multiple, можна відправити кілька файлів.
    // Зараз ми обробляємо лише перший вибраний файл.
    handleSendMessage(files[0]);
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
    &__attach {
      @apply ml-2 w-8 h-8;
    }

    &__btn {
      @apply ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold;
      @apply w-1/5 py-2 px-4 rounded;
    }
  }
}

</style>
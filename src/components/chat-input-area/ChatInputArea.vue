<template>
  <div v-if="activeDialog" class="chat-inputArea">
    <div class="flex justify-center items-center space-x-2">
      <input
        type="text"
        v-model="newMessageText"
        @keyup.enter="() => handleSendMessage()"
        placeholder="Enter message..."
        class="chat-inputArea__input flex-grow"
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
        <button @click="triggerFileInput" class="chat-inputArea__attach mt-1">
          <svg height="32px" width="32px" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 280.067 280.067" xml:space="preserve" fill="#3b82f6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#3b82f6;" d="M149.823,257.142c-31.398,30.698-81.882,30.576-113.105-0.429 c-31.214-30.987-31.337-81.129-0.42-112.308l-0.026-0.018L149.841,31.615l14.203-14.098c23.522-23.356,61.65-23.356,85.172,0 s23.522,61.221,0,84.586l-125.19,123.02l-0.044-0.035c-15.428,14.771-40.018,14.666-55.262-0.394 c-15.244-15.069-15.34-39.361-0.394-54.588l-0.044-0.053l13.94-13.756l69.701-68.843l13.931,13.774l-83.632,82.599 c-7.701,7.596-7.701,19.926,0,27.53s20.188,7.604,27.88,0L235.02,87.987l-0.035-0.026l0.473-0.403 c15.682-15.568,15.682-40.823,0-56.39s-41.094-15.568-56.776,0l-0.42,0.473l-0.026-0.018l-14.194,14.089L50.466,158.485 c-23.522,23.356-23.522,61.221,0,84.577s61.659,23.356,85.163,0l99.375-98.675l14.194-14.089l14.194,14.089l-14.194,14.098 l-99.357,98.675C149.841,257.159,149.823,257.142,149.823,257.142z"></path> </g> </g></svg>
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
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import { MessagePayload } from "@/types/app.types";
import { useUserStore } from "@/store/user";
// import { uploadFile } from "@/services/apiService";

const props = defineProps<{
  currentDialogId: string | null;
  userProfileId: string | null | undefined;
  receiverId: string | null | undefined;
}>();

const emit = defineEmits(['send-message']);
const userState = useUserStore()
const activeDialog = computed(() => { return userState.activeDialog })
const fileInput = ref<HTMLInputElement | null>(null);
const newMessageText = ref('');

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const handleSendMessage = async (file?: File) => {
  if (newMessageText.value.trim() || file) {
    const type = file
      ? file.type.startsWith('image/')
        ? 'image'
        : 'video'
      : 'text';

    const payload: MessagePayload = {
      id: props.receiverId || '',
      dialogId: props.currentDialogId || '',
      senderId: props.userProfileId || '',
      createdAt: Date.now(),
      type: type,
    };

    if (type === 'text') {
      payload.content = newMessageText.value.trim();
    } else if (file) {
      // const fileUrl = await uploadFile(file)  - завантаження файлу на сервер
      const fileUrl = URL.createObjectURL(file);
      if (type === 'image') {
        payload.imageUrl = fileUrl;
      } else if (type === 'video') {
        payload.videoUrl = fileUrl;
      }
    }

    emit('send-message', payload);
    newMessageText.value = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    handleSendMessage(files[0]);
  }
};
</script>

<style scoped lang="scss">
.chat-inputArea {
  @apply p-4 border-t border-gray-200;

  &__input {
    @apply bg-blue-200 text-black rounded-r-md px-4 py-2 font-medium hover:bg-blue-400 flex-grow;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
  &__attach {
    @apply ml-2 w-8 h-8 cursor-pointer;
  }

  &__btn {
    @apply ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-r-md;
  }
}
</style>
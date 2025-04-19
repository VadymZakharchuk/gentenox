<template>
  <div class="side-bar">
    <div v-if="userProfile" class="side-bar__user">
      <img :src="userProfile.avatar" alt="user avatar" class="side-bar__user-avatar">
      <span class="font-semibold">{{ userProfile.name }}</span>
    </div>
    <h2 class="side-bar__dialogs">Dialogs</h2>
    <ul class="side-bar__dialogs-list">
      <li v-for="dialog in dialogs"
          :key="dialog.id"
          @click="$emit('select-dialog', dialog.id)"
          class="side-bar__dialogs-item">
        <div class="flex justify-between">
          <span>{{ getParticipantNames(participants) }}</span>
          <span>{{ new Date(dialog.updatedAt).toLocaleString('en-Uk') }}</span>
        </div>
        <div v-if="dialog.lastMessage" class="text-sm text-gray-500">
          {{ formatLastMessage(dialog.lastMessage) }}
        </div>
      </li>
    </ul>
    <div v-if="hasMoreDialogs" class="mt-4">
      <button @click="$emit('load-more-dialogs')"
              class="side-bar__btn">
        Load more
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DialogItem, Profile, Message} from "@/types/app.types"

const props = defineProps<{
  dialogs: DialogItem[];
  participants: Profile[];
  totalDialogs: number;
  hasMoreDialogs: boolean;
  userProfile: Profile | null;
}>();
const emit = defineEmits(['select-dialog', 'load-more-dialogs']);
const userId = localStorage.getItem('userId');

const getParticipantNames = (list: Profile[]) => {
  if (!props.userProfile) return 'Loading...';

  const res: Profile[] = list.filter(item => item.id !== props.userProfile!.id)
  return res.map(r => r!.name).join(', ')
}

const formatLastMessage = (lastMessage: Message) => {
  if (!lastMessage || !lastMessage.payload) return '';
  switch (lastMessage.payload.type) {
    case 'text':
      return lastMessage.payload.content;
    case 'image':
      return 'Image';
    case 'video':
      return 'Video';
    default:
      return 'Message';
  }
};
</script>

<style scoped lang="scss">
.side-bar {
  @apply w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col;

  &__user {
    @apply mb-4 flex items-center;
    &-avatar {
      @apply w-10 h-10 rounded-full mr-2;
    }
  }
  &__dialogs {
    @apply text-lg font-semibold text-gray-700 mb-2;

    &-list{
      @apply flex-grow overflow-y-auto;
    }
    &-item {
      @apply cursor-pointer p-2 rounded hover:bg-gray-200;
    }
  }
  &__btn {
    @apply w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded;
  }
}
</style>
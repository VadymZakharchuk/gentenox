import { defineStore } from 'pinia'
import { Profile } from "@/types/app.types";

type UserState = {
  user: Profile
}

export const useUserStore = defineStore('userStore', {
  state: (): UserState => ({
    user: {
      id: '',
      name: '',
      avatar: ''
    }
  }),

  getters: {
    userData: (state): Profile => {
      return state.user;
    }
  },
})


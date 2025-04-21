import { defineStore } from 'pinia'
import { Profile } from "@/types/app.types";

type UserState = {
  user: Profile,
  activeDialog: string
}

export const useUserStore = defineStore('userStore', {
  state: (): UserState => ({
    user: {
      id: '',
      name: '',
      avatar: ''
    },
    activeDialog: ''
  }),

  getters: {
    userData: (state): Profile => {
      return state.user;
    },
    actDialog: state => { return state.activeDialog}
  },
})


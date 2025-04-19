import { defineStore } from 'pinia'
import { Profile } from "@/types/app.types";

interface UserState {
  user: Profile;
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {} as Profile
  }),

  getters: {
    userData: (state: UserState): Profile => {
      return state.user;
    }
  },

})

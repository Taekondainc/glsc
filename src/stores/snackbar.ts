import { defineStore } from 'pinia'

export const usesnackbarStore = defineStore('snackbarloader', {
  state: () => ({
    snackbar: { message: '', color: '', loader: false, status: '' }
  }),
  getters: {
    getSnackbar() {
      return this.snackbar
    }
  },
  actions: {
    showSnackbar(message, color, status, loader = false) {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.loader = loader
      this.snackbar.status = status
    }
  }
})

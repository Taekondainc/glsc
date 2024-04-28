import { defineStore } from 'pinia'

export const usesnackbarStore = defineStore('snackbarloader', {
  state: () => ({
    snackbar: {
      message: 'info',
      color: 'info',
      loader: false,
      status: 'loading values',
      timer: 3000
    }
  }),
  getters: {
    getSnackbar() {
      return this.snackbar
    }
  },
  actions: {
    showSnackbar(message, color, loader = false, status) {
      this.snackbar = {
        message: message,
        color: color,
        loader: loader,
        status: status,
        timer: 2000
      }
    }
  }
})

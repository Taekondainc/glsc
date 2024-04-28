<template>
  <div class="text-center ma-2 d-flex">
    <v-snackbar
      v-model="snackbar.loader"
      :timeout="snackbar.timer"
      :color="snackbar.color"
      class="d-flex pa-3"
      location="bottom right"
    >
      <div>{{ snackbarStore.snackbar.status }}</div>
      <template v-slot:actions>
        <div v-if="snackbar.message == 'info' || snackbar.message == 'error'">
          <v-progress-circular
            v-show="loader"
            :model-value="value"
            :indeterminate="loader"
            color="primary"
          />
        </div>
        <span class="material-symbols-outlined"> check_circle </span>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { usesnackbarStore } from '../../stores/snackbar.ts'
export default {
  name: 'snack-bar',
  data() {
    return {
      snackbarStore: usesnackbarStore(),
      value: 100,
      text: '',
      loader: true,
      snackbarvalue: ''
    }
  },
  computed: {
    snackbar() {
      return this.snackbarStore.getSnackbar
    }
  }
}
</script>

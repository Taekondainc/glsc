<template>
  <div class="text-center ma-2 d-flex">
    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarvalue != 'info' || snackbarvalue != 'error' ? 3000 : -1"
      :color="snackbarvalue != 'info' ? 'success' : 'error'"
      class="d-flex pa-3"
      location="bottom right"
    >
      <div v-if="snackbarvalue == 'success'">{{ snackbarstore.snackbar.status }}</div>
      <div v-else-if="snackbarvalue == 'error'">{{ snackbarstore.snackbar.status }}</div>
      <div v-else>{{ snackbarstore.snackbar.status }}</div>
      <template v-slot:actions>
        <div v-if="snackbarvalue == 'info' || snackbarvalue == 'error'">
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
      snackbarstore: usesnackbarStore(),
      snackbar: true, // Initialize as null to avoid undefined errors
      value: 100,
      text: '',
      loader: true,
      snackbarvalue: ''
    }
  },
  computed: {
    snackbarelay() {
      return this.snackbarstore.getSnackbar
    }
  },
  watch: {
    snacks() {}
  },
  mounted() {
    setTimeout(() => {
      if (this.snackbarstore.getSnackbar.message == 'error') {
        this.snackbarvalue = 'error'
        this.loader = true
        this.snackbar = true
        console.log('error')
      } else if (this.snackbarstore.getSnackbar.message == 'info') {
        this.snackbarvalue = 'info'
        this.loader = true
        this.snackbar = true
        console.log('info')
      } else if (this.snackbarstore.getSnackbar.message == 'success') {
        this.snackbarvalue = 'success'
        this.loader = true
        this.snackbar = true
        console.log('Success')
      } else if (this.snackbarstore.getSnackbar.message == 'loading') {
        this.snackbarvalue = 'loading'
        this.loader = true
        this.snackbar = true
        console.log('loader')
      } else {
        this.snackbarvalue = 'info'
        this.loader = true
        this.snackbar = true
        console.log('info')
      }
    }, 5000)

    // Now this should log the snackbar object
  },
  created() {
    this.snackbarelay
    // This ensures the store has finished initializing before accessing snackbar
  },
  methods: {
    change() {
      this.loader = !this.loader
    },
    updated() {}
  }
}
</script>

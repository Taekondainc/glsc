<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      class="teal-darken-1 text--white"
      color="teal-darken-1"
      app
    >
      <v-list>
        <v-list-item to="/" class="d-flex">
          <img src="https://glsc.gov.gy/wp-content/uploads/2017/11/logo4.png" style="width: 75%" />
        </v-list-item>
      </v-list>

      <!-- Nested list -->
      <v-list>
        <!-- List item for '/' route -->
        <v-list-item to="/" class="d-flex">
          <span class="material-symbols-outlined"> groups </span>
          &nbsp;&nbsp;Applicants
        </v-list-item>

        <!-- List item for '/Create-Person' route -->
        <v-list-item to="/Create-Person">
          <span class="material-symbols-outlined"> person_add </span> &nbsp;&nbsp;Create Applicant
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="teal-darken-1">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="teal--text text--darken-2"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="teal--text text--darken-2">
        <div><b> Land Management System</b></div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-account" variant="tonal" color="white" size="lg" class="mx-10 pa-2"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <Snackbar />
    <div v-if="loadingModal" class="modaldiv">
      <v-progress-circular
        :indeterminate="loadingModal"
        size="200"
        color="teal-accent-3"
      ></v-progress-circular>
    </div>
  </v-app>
</template>
<script setup>
import Snackbar from '@/components/Snackbar/snackbar.vue'
import { usesnackbarStore } from '@/stores/snackbar'
import { ref, watch } from 'vue'
const name = 'App'
const loadingModal = ref(true)
const drawer = ref(false)
const snackbarstore = usesnackbarStore()
const lvalue = ref()
setTimeout(() => {
  loadingModal.value = false
  snackbarstore.showSnackbar('Page successfully Loaded', 'info', true, 'Page successfully Loaded')
}, 1000)
</script>
<style>
.modaldiv {
  position: fixed;
  display: flex;
  background-color: rgba(0, 0, 0, 0.666);
  justify-content: center;
  align-items: center;
  top: 0;
  height: 100%;
  width: 100%;
}
</style>

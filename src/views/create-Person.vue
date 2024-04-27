<template>
  <div class="d-flex justify-center w-100 justify-center">
    <v-form @submit.prevent="Submit" class="w-50 my-10 border-md pa-3 rounded">
      <div class="text-h3 pa-3 my-4">Applicant's Form</div>
      <v-text-field
        v-model="formData.username"
        label="Username"
        class="text-h5 my-7"
        required
        variant="outlined"
        @input="checkErrors"
        :error-messages="usernameErrors"
      />

      <v-text-field
        v-model="formData.name"
        label="Name"
        class="text-h5 my-7"
        required
        variant="outlined"
        :error-messages="nameErrors"
        @input="checkErrors"
      />

      <v-text-field
        v-model="formData.website"
        label="Website"
        class="text-h5 my-7"
        :error-messages="websiteErrors"
        @input="checkErrors"
        variant="outlined"
        :rules="[
          (v) => !!v || 'Website is required',
          (v) => /^[\w.-]+(\.[a-z]{2,6})+$/.test(v) || 'Invalid website URL format'
        ]"
      />

      <v-text-field
        v-model="formData.email"
        label="Email"
        class="text-h5 my-7"
        required
        variant="outlined"
        :rules="[
          (v) => !!v || 'Email is required',
          (v) => /.+@.+\..+/.test(v) || 'Invalid email format'
        ]"
      />

      <v-btn color="primary" variant="tonal" @click="reset" class="mr-2">Clear Form</v-btn>
      <v-btn type="submit" color="success" class="border-sm" variant="tonal">Submit</v-btn>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { usesnackbarStore } from '@/stores/snackbar'
const formData = ref({
  username: '',
  name: '',
  website: '',
  email: ''
})

const snackbarstore = usesnackbarStore()
const initialState = {
  username: ' ',
  name: ' ',
  website: ' ',
  email: ' '
}
// Flag for form validity (optional, for disabling submit on errors)
const usernameErrors = ref([])
const nameErrors = ref([])
const websiteErrors = ref([])
const emailErrors = ref([])

function reset() {
  formData.value = { ...initialState }
}

function checkErrors() {
  const hasEmptyFields = !(
    formData.value.username.trim() &&
    formData.value.name.trim() &&
    formData.value.website.trim() &&
    formData.value.email.trim()
  )

  if (hasEmptyFields) {
    usernameErrors.value = formData.value.username.trim() ? [] : ['Username is required']
    nameErrors.value = formData.value.name.trim() ? [] : ['Name is required']
    emailErrors.value = formData.value.email.trim() ? [] : ['Email is required']
    websiteErrors.value = formData.value.website.trim() ? [] : ['Website is required']

    return false
  }

  return true
}
async function Submit(event) {
  event.preventDefault()

  if (checkErrors() === true) {
    const newItem = {
      id: Math.random(),
      username: formData.value.username,
      name: formData.value.name,
      website: formData.value.website,
      email: formData.value.email
    }

    const storedItems = JSON.parse(localStorage.getItem('items'))

    if (storedItems === null) {
      localStorage.setItem('items', JSON.stringify([newItem]))
      snackbarstore.showSnackbar('success')
    } else {
      storedItems.push(newItem)
      localStorage.setItem('items', JSON.stringify(storedItems))
      snackbarstore.showSnackbar('success')
    }
  } else {
    return
  }

  reset()
}
</script>

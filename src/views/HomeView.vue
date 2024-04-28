<template>
  <v-data-table
    :headers="headers"
    class="rows my-5"
    v-model="selected"
    :items="persons"
    :search="search"
    :sort-by="[{ key: 'username', order: 'asc' }]"
    :hover="true"
    show-select
  >
    <template v-slot:top>
      <v-toolbar tonal color="teal-darken-1 my-3">
        <v-toolbar-title class="text-h4">Applicant's Table</v-toolbar-title>
        <v-divider class="mx-4" inset vertical v-show="selected.length == 0"></v-divider>
        <v-btn color="white" class="" variant="plain" @click="initialize()">
          refresh
          <v-icon class="mx-1" size="large" color="white"> mdi-refresh </v-icon>
        </v-btn>

        <v-divider class="mx-4" inset vertical v-show="!selected.length == 0"></v-divider>
        <v-btn
          color="error"
          class=""
          v-show="!selected.length == 0"
          variant="flat"
          @click="deletedItems()"
        >
          Delete
          <v-icon class="mx-1" size="large" color="white"> mdi-delete </v-icon>
        </v-btn>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          class="text-white"
          hide-details
          color="white"
          bg-color="white"
          variant="outlined"
          single-line
        ></v-text-field>
        <v-divider class="mx-2" inset vertical></v-divider>
      </v-toolbar>
      <v-dialog v-model="dialogDeleted" :max-width="selected == 0 ? '500px' : '585px'">
        <v-card>
          <v-card-title class="text-h5 text-center" v-if="selected == 0"
            >Are you sure you want to delete {{ editedItem.username }}</v-card-title
          >
          <v-card-title class="text-h5" v-else
            >Are you sure you want to delete these Applicants???</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="tonal" @click="closeDeleted">Cancel</v-btn>
            <v-btn color="success" variant="tonal" @click="deleteItemsConfirmed()">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card class="w-85 elevation-1 pa-5 py-5">
          <div class="text-h2 mt-5 teal--text text--darken-2">
            <b>Update {{ editedItem.username }}'s Data</b>
          </div>
          <v-divider class="my-4"></v-divider>
          <v-container class="flex">
            <v-text-field
              v-model="editedItem.username"
              class="my-2"
              variant="outlined"
              label="Username"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              v-model="editedItem.name"
              class="my-2"
              label="Name"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              v-model="editedItem.email"
              class="my-2"
              label="Email"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              v-model="editedItem.website"
              class="my-2"
              label="website"
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-btn color="error" variant="tonal" @click="close"> Cancel </v-btn>
            <v-btn color="success" variant="tonal" @click="save(editedItem.id)"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 text-center"
            >Are you sure you want to delete {{ editedItem.username }}</v-card-title
          >

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="tonal" @click="closeDelete">Cancel</v-btn>
            <v-btn color="success" variant="tonal" @click="deleteItemConfirm(editedItem.id)"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip text="Edit applicant" location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon class="mx-1" v-bind="props" color="primary" size="large" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Applicant" location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon class="mx-1" size="large" color="error" v-bind="props" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script setup>
import axios from 'axios'
import { usesnackbarStore } from '@/stores/snackbar'
import { ref, onMounted } from 'vue'

const dialog = ref(false)
const dialogDelete = ref(false)
const dialogDeleted = ref(false)
const search = ref('')
const selected = ref([])
const headers = ref([
  { title: 'Username', key: 'username' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Website', key: 'website' },
  { title: 'Actions', key: 'actions', sortable: false }
])
const persons = ref([])
const snackbarstore = usesnackbarStore()
const editedIndex = ref(-1)
const editedItem = ref({
  name: '',
  username: '',
  email: '',
  website: ''
})
const defaultItem = ref({
  name: '',
  username: '',
  email: '',
  website: ''
})

onMounted(initialize)

async function initialize() {
  if (localStorage.getItem('items') == null) {
    axios
      .get(`https://jsonplaceholder.typicode.com/users?_limit=15`)
      .then((res) => {
        const json = res.data
        persons.value = json
        localStorage.setItem('items', JSON.stringify(json))

        snackbarstore.showSnackbar('success', 'success', true, 'successfully Load')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  } else if (localStorage.getItem('items') == '[]') {
    axios
      .get(`https://jsonplaceholder.typicode.com/users?_limit=15`)
      .then((res) => {
        const json = res.data
        persons.value = json
        localStorage.setItem('items', JSON.stringify(json))
        snackbarstore.showSnackbar('success', 'success', true, 'successfully Loaded')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  } else if (localStorage.getItem('items') != '[]' && localStorage.getItem('items') != null) {
    const fields = JSON.parse(localStorage.items)
    persons.value = fields
    snackbarstore.showSnackbar('success', 'success', true, 'successfully loaded')
  } else {
    snackbarstore.showSnackbar('success', 'success', true, 'successfully loaded')
  }
}

function editItem(values) {
  editedIndex.value = persons.indexOf(values)
  editedItem.value = Object.assign({}, value)
  dialog.value = true
}

function deleteItem(item) {
  editedIndex.value =persons.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function deleteItemConfirm(value) {
   persons.splice(this.editedIndex, 1)

  let storedValues = JSON.parse(localStorage.getItem('items')) || []
  const storeindex = storedValues.findIndex((val) => val.id === value)
  const person = storedValues[storeindex].username

  storedValues = storedValues.filter((item) => item.id !== value)

  persons.value = storedValues
  localStorage.setItem('items', JSON.stringify(storedValues))

  snackbarstore.showSnackbar('success', 'success', true, `successfully Deleted ${person}`)

  closeDelete()
}
function deletedItems() {
  dialogDeleted.value = true
}
function deleteItemsConfirmed() {
  const savedValues = persons.value
  const values = persons.value.filter((item) => !selected.value.includes(item.id))
  persons.value = values

  localStorage.setItem('items', JSON.stringify(values))
  if (selected.value.length < 2) {
    const id = selected.value[0]
    const personid = savedValues.findIndex((item) => item.id === id)

    const applicant = savedValues[personid].username

    snackbarstore.showSnackbar('success', 'success', true, `successfully Deleted ${applicant}`)
  } else {
    snackbarstore.showSnackbar('success', 'success', true, 'successfully Deleted Aplicants')
  }

  closeDeleted()
}
function closeDeleted() {
  dialogDeleted.value = false

  selected.value = []
}
function close() {
  dialog.value = false
  ref(() => {
    editedItem.value = Object.assign({}, this.defaultItem)
    editedIndex.value = -1
  })
}

function closeDelete() {
  dialogDelete.value = false
  ref(() => {
    editedItem.value = Object.assign({}, this.defaultItem)
    editedIndex.value = -1
    selected.value = []
  })
}

function save(value) {
  if (this.editedIndex > -1) {
    Object.assign(persons[this.editedIndex], this.editedItem)

    const newItem = {
      name: this.editedItem.name,
      username: this.editedItem.username,
      email: this.editedItem.email,
      website: this.editedItem.website
    }
    let storedValues = JSON.parse(localStorage.getItem('items')) || []

    const index = storedValues.findIndex((item) => item.id === value)

    storedValues[index] = newItem
    const person = storedValues[index].username

    persons.value = storedValues
    localStorage.setItem('items', JSON.stringify(storedValues))

    snackbarstore.showSnackbar('success', 'success', true, `${person} successfully updated`)
  } else {
    snackbarstore.showSnackbar('success', 'success', true, `${person}successfully updated`)
  }
  this.close()
}
</script>
<style>
.rows tbody tr:nth-child(even) {
  background-color: #ffff !important;
}

.rows tbody tr:nth-child(odd) {
  background-color: #e0f2f1 !important;
}
</style>

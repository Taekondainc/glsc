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
      <v-dialog v-model="dialogDeleted" :max-width="this.selected == 0 ? '500px' : '585px'">
        <v-card>
          <v-card-title class="text-h5 text-center" v-if="this.selected == 0"
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
        <!-- <template v-slot:activator="{ props }">
            <v-btn
              class="mb-2 elevation-3 border-2 border-white"
              variant="outlined"
              color="white"
              dark
              v-bind="props"
            >
              Create Person
            </v-btn>
          </template> -->
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
<script>
import axios from 'axios'
import { usesnackbarStore } from '@/stores/snackbar'
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogDeleted: false,
    search: '',
    hidesection: false,
    selected: [],
    headers: [
      { title: 'Username', key: 'username' },
      { title: 'Name', key: 'name' },
      { title: 'Email', key: 'email' },
      { title: 'Website', key: 'website' },
      { title: 'Actions', key: 'actions', sortable: false }
    ],
    persons: [],
    snackbarstore: usesnackbarStore(),
    editedIndex: -1,
    editedItem: {
      name: '',
      username: '',
      email: '',
      website: ''
    },
    defaultItem: {
      name: '',
      username: '',
      email: '',
      website: ''
    }
  }),

  computed: {
    //   snackbarshowing() {
    //     return this.snackbarstore.showSnackbar('success', 'success', ' true')
    //   },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  mounted() {
    // if (this.$refs.selected != null) this.hidesection = true
    // else this.hidesection = false
  },
  watch: {},
  created() {
    this.initialize()
    // this.snackbarstore.showSnackbar('info')
    // console.log(this.snackbarstore.snackbar)
  },

  methods: {
    initialize() {
      setTimeout(() => {
        if (localStorage.getItem('items') == null) {
          axios
            .get(`https://jsonplaceholder.typicode.com/users?_limit=15`)
            .then((res) => {
              const json = res.data
              this.persons = json
              localStorage.setItem('items', JSON.stringify(json))

              this.snackbarstore.showSnackbar(
                'success',
                'success',
                'successfully Loaded !!!',
                'true'
              )
            })
            .catch((error) => {
              console.error('Error fetching data:', error)
            })
        } else if (localStorage.getItem('items') == '[]') {
          axios
            .get(`https://jsonplaceholder.typicode.com/users?_limit=15`)
            .then((res) => {
              const json = res.data
              this.persons = json
              localStorage.setItem('items', JSON.stringify(json))
              this.snackbarstore.showSnackbar(
                'success',
                'success',
                'successfully Loaded !!!',
                'true'
              )
            })
            .catch((error) => {
              console.error('Error fetching data:', error)
            })
        } else if (localStorage.getItem('items') != '[]' && localStorage.getItem('items') != null) {
          this.snackbarstore.showSnackbar('success', 'success', 'successfully Loaded !!!', 'true')
          const fields = JSON.parse(localStorage.items)
          this.persons = fields
        } else {
          this.snackbarstore.showSnackbar('success', 'success', 'successfully Loaded !!!', 'true')
        }
      }, 1000)
    },

    editItem(value) {
      this.editedIndex = this.persons.indexOf(value)
      this.editedItem = Object.assign({}, value)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.persons.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm(value) {
      this.persons.splice(this.editedIndex, 1)

      let storedValues = JSON.parse(localStorage.getItem('items')) || []

      storedValues = storedValues.filter((item) => item.id !== value)
      this.persons = storedValues
      localStorage.setItem('items', JSON.stringify(storedValues))

      this.snackbarstore.showSnackbar('success', 'success', 'successfully updated', 'true')

      this.snackbarshowing
      this.closeDelete()
    },
    deletedItems() {
      this.dialogDeleted = true
    },
    deleteItemsConfirmed() {
      const values = this.persons.filter((item) => !this.selected.includes(item.id))
      this.persons = values

      localStorage.setItem('items', JSON.stringify(values))
      this.snackbarstore.showSnackbar('success', 'success', 'successfully updated', 'true')
      this.snackbarshowing
      this.closeDeleted()
      // console.log(values)
      // console.log(this.persons)
    },
    closeDeleted() {
      this.dialogDeleted = false

      this.selected = []
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.selected = []
      })
    },

    save(value) {
      if (this.editedIndex > -1) {
        Object.assign(this.persons[this.editedIndex], this.editedItem)

        const newItem = {
          name: this.editedItem.name,
          username: this.editedItem.username,
          email: this.editedItem.email,
          website: this.editedItem.website
        }
        let storedValues = JSON.parse(localStorage.getItem('items')) || []

        const index = storedValues.findIndex((item) => item.id === value)

        storedValues[index] = newItem

        this.persons = storedValues
        localStorage.setItem('items', JSON.stringify(storedValues))

        this.snackbarstore.showSnackbar('success', 'success', 'successfully updated', 'true')
      } else {
        this.snackbarstore.showSnackbar('success', 'success', 'successfully updated', 'true')
      }
      this.close()
    }
  }
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

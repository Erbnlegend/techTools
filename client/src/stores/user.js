import { writable } from 'svelte/store'

const user = writable({
  technicians: [],
  user: '',
  showUserForm: false
})

export default user
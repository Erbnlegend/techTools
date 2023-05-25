import { writable } from 'svelte/store'

const comments = writable({
  service: '',
  comments: [],
  technicians: [],
  files: []
})

export default comments
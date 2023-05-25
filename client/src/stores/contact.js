import { writable } from 'svelte/store'

const contact = writable({
  contact: 0,
  selected: false,
  switch: false
})

export default contact
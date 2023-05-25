import { writable } from 'svelte/store'
import { format } from 'date-fns'

const date = format(new Date(), 'MM/dd/yyyy')
const unixDate = format(new Date(), 'yyyy-MM-dd')

const trips = writable({
  tripList: [],
  tripsDue: [],
  showSummary: true,
  showAll: false,
  date,
  unixDate
})

export default trips
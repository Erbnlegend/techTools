import { writable } from 'svelte/store'
import { format } from 'date-fns'

const date = format(new Date(), 'MM/dd/yyyy')
const unixDate = format(new Date(), 'yyyy-MM-dd')

const BatchInfo = writable({
  offset: 0,
  count: 1,
  numQuery: 0,
  searchField: '',
  dataAvailable: false,
  searchable: false,
  searchableList: [],
  result: [],
  dueToday: [],
  date,
  unixDate
})

export default BatchInfo

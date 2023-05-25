<script>
  import { onMount } from 'svelte'
  import { Router, Route, Link } from 'svelte-navigator'
  import BatchInfo from '../stores/BatchInfo.js'
  import axios from 'axios'
  import Fuse from 'fuse.js'
  
  import Card from '../components/Card.svelte'
  import currentMode from '../util/mode.js'
  import { parseISO, format, isSameDay } from 'date-fns'

  export const unixDate = format(new Date(), 'yyyy/MM/dd')
  const limit = 100
  const url = currentMode.getMode()

  onMount(async () => {
    // reset state/store
    if ($BatchInfo.searchableList.length === Number($BatchInfo.count)) {
      scripts.checkdata()
      return
    }
    if ($BatchInfo.searchableList.length !== Number($BatchInfo.count)) {
      BatchInfo.update(data => {
      return {
        ...data,
        offset: 0
      }
    })
    try {
      const response = await axios.get(`http://${url}/api/list?offset=${$BatchInfo.offset}`)
      BatchInfo.update(data => {
        return {
          ...data,
          offset: 0,
          count: response.data.count,
          numQuery: Math.ceil(response.data.count / limit),
          searchable: true,
          searchableList: response.data.findRelated
        }
      })
      scripts.initResults()
      if ($BatchInfo.numQuery > 0) {
        for (let i = $BatchInfo.numQuery; i >= 0; i--) {
          scripts.batchData()
        }
      }
      } catch (error) {
          console.log(error)
      }
    }
  })

  const options = {
    includeScore: true,
    threshold: .1,

    keys: [
      'data_id',
      'entity_id',
      'entity_name',
      'company_name',
      'service_order',
      'owner',
      'trips.date_set'
    ]
  }
  
  const strictOptions = {
    includeScore: true,
    threshold: 0,

    keys: [
      'trips.date_set'
    ]
  }
  

  const scripts = {

    async batchData () {
      BatchInfo.update(data => {
        return {
          ...data,
          offset: data.offset + limit
        }
      })
      try {
        const response = await axios.get(`http://${url}/api/list?offset=${$BatchInfo.offset}`)
        BatchInfo.update(data => {
          return {
            ...data,
            offset: data.offset + limit,
            searchableList: [...data.searchableList, ...response.data.findRelated]
          }
        })
      } catch (error) {
        console.log(error)
      }
      this.initResults()
      this.checkdata()
    },

    checkdata () {
    if ( $BatchInfo.searchableList.length === Number($BatchInfo.count) )
      BatchInfo.update(data => {
        return {
          ...data,
          dataAvailable: true,
        }
      })
    },

    async initResults () {
      const fuse = new Fuse($BatchInfo.searchableList, strictOptions)
      const results = fuse.search($BatchInfo.date)

      BatchInfo.update(data => {
        return {
          ...data,
          searchField: '',
          dueToday: [...results],
          result: [...results]
        }
      })
    },

    async setDate (e) {
      const rawDate = new Date(parseISO(e.target.value))
      
      const formatDate = format(parseISO(e.target.value), 'MM/dd/yyyy')
      const formatDateUnix = format(parseISO(e.target.value), 'yyyy-MM-dd')
      // This updates searchable list itself
      const findRelated = $BatchInfo.searchableList.map(item => {
      const tripsDue = item.trips.filter(dataMatch => {
        const dateSet = new Date(dataMatch.date_set)
        return isSameDay(dateSet, rawDate) && Number(dataMatch.trip_id) === Number(item.data_id)
      })
        return {
          ...item,
          tripsDue: tripsDue
        }
      })
        BatchInfo.update(data => {
        return {
          ...data,
          searchableList: findRelated
        }
      })
        const fuse = new Fuse($BatchInfo.searchableList, strictOptions)
        const results = fuse.search(formatDate)
        BatchInfo.update(data => {
          return {
            ...data,
            searchField: '',
            date: formatDate,
            unixDate: formatDateUnix,
            dueToday: results,
            result: results
          }
        })
    },

    getSearchValue (e) {
      const fuse = new Fuse($BatchInfo.searchableList, options)
      const setResult = fuse.search(e.target.value)
      BatchInfo.update(data => {
        return {
          ...data,
          searchField: e.target.value,
          result: setResult
        }
      })
      if (e.target.value === '') {
        BatchInfo.update(data => {
          return {
            ...data,
            result: data.dueToday
          }
        })
      }
    }
  }
</script>

{#if !$BatchInfo.searchable}
<div class="loader">
  <span>Loading</span>
  <span class="ellips"></span>
  <span class="ellips"></span>
  <span class="ellips"></span>
</div>
{/if}

{#if $BatchInfo.searchable}
  <input class="search" on:input={scripts.getSearchValue} type="search" placeholder="Search Services" value={$BatchInfo.searchField} />
  {#if !$BatchInfo.dataAvailable}
  <div class="loader small">
    <span>Loading additional records</span>
    <span class="ellips"></span>
    <span class="ellips"></span>
    <span class="ellips"></span>
  </div>
  {/if}
{/if}


<div class="wrapper">
  <div class="caseStatuses">
    {#if $BatchInfo.dataAvailable}
      <input class="due" type="date" on:input={scripts.setDate} value={$BatchInfo.unixDate}/>
    {/if}
    {#if !$BatchInfo.dataAvailable}
      <input class="due" type="date" on:input={scripts.setDate} value={$BatchInfo.unixDate} disabled/>
    {/if}
      {$BatchInfo.date} services: {$BatchInfo.dueToday.length}
  </div>
  {#key $BatchInfo.result}
  <div class="cards">
    { #each $BatchInfo.result as results}
    <Router>
      <Link class='links' to='trips/{results.item.data_id}'>
        <Card data={results}>
        </Card>
      </Link>
    </Router>
    { /each }
  </div>
  {/key}
</div>
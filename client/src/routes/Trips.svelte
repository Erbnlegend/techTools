<script>
  import axios from "axios"
  export let data
  import { onMount } from "svelte"
  import { Link } from "svelte-navigator"
  import { format, isSameDay, parseISO } from 'date-fns'

  import currentMode from '../util/mode.js'
  import ActionButtons from "../components/ActionButtons.svelte"
  import showAllTrips from '../util/tripButton.js'
  import Summary from "../components/sub_components/Summary.svelte"
  import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-svelte'
  import trips from "../stores/trips.js"
  import BatchInfo from "../stores/BatchInfo.js"
  import EditTrips from "../components/sub_components/EditTrips.svelte"
  import TimerTrip from "../components/sub_components/TimerTrip.svelte"
  const url = currentMode.getMode()
  
  onMount( async () => {
    try {
      const response = await axios.get(`http://${url}/api/listtrips?serviceId=${data.id}`)
      trips.update(data => {
        return {
          ...data,
          tripList: response.data.findRelated,
          date: $BatchInfo.date
        }
      })
      createDue()
    } catch (error) {
      console.log(error)
    }
  })

  const setDate = (e) => {
    const rawDate = format(new Date(parseISO(e.target.value)), 'MM/dd/yyyy')
    trips.update(data => {
      return {
        ...data,
        date: rawDate
      }
    })
    createDue()
  }

  const createDue = () => {
    const date = new Date($trips.date)
    const tripsList = $trips.tripList[0].trips
    const createTripsDue = tripsList.filter(dbMatch => {
      const dateSet = new Date(dbMatch.date_set)
      return isSameDay(dateSet, date)
    })
    trips.update(data => {
      return {
        ...data,
        tripsDue: createTripsDue
      }
    })
  }

</script>

  {#each $trips.tripList as trip}
  <div class="subNav">
    <Link to="/"><ChevronLeft class="backIcon"/></Link>
    <h1>SO000{trip.data_id}</h1>
  </div>
  <div class="actionsWrapper">
    <ActionButtons data={trip}/>
  </div>
  {/each}

<div class="wrapper">
  {#each $trips.tripList as trip}
    <Summary data={trip}/>
  {/each}
  <div class="dueToday">
    <input class="due" type="date" value={$BatchInfo.unixDate} on:change={setDate}/>
    {#if $trips.tripsDue.length === 0}
      <p>There are no trips on {$trips.date}</p>
    {/if}
    <div class="cards">
      <TimerTrip data={data}/>
    </div>
  </div>

  {#if $trips.showAll}
  <div on:click={showAllTrips.showAllTrips} on:keydown={showAllTrips.showAllTrips} class="flex switch">
    <div>Hide All Trips</div>
    <ChevronUp />
  </div>
  {/if}

  {#if !$trips.showAll}
  <div on:click={showAllTrips.showAllTrips} on:keydown={showAllTrips.showAllTrips} class="flex switch">
    <div>Show All Trips</div>
    <ChevronDown />
  </div>
  {/if}
  
  <div class="cards">
    <EditTrips />
  </div>
</div>
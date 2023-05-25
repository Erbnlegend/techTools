<script>
    import { format } from "date-fns";

  export let data

  import trips from "../../stores/trips"
  import timerButtons from '../../util/tripTimers'

  const startTravel = (e) => {
    timerButtons.startTravel(e, data.id)
  }

  const endTravel = (e) => {
    timerButtons.endTravel(e, data.id)
  }

  const startLabor = (e) => {
    timerButtons.startLabor(e, data.id)
  }

  const endLabor = (e) => {
    timerButtons.endLabor(e, data.id)
  }
</script>

{ #each $trips.tripsDue.sort((a, b) => Number(a.data_id) - Number(b.data_id)) as trips (trips.data_id)}
  <div class="tripsCard">
    <div class="card">
      <div class="title">
        <div class="customer">
          Scheduled: {trips.date_set}
        </div>
        <div class="service">
          Allocated Hours: {trips.allocated_hours}
        </div>
        <div class="created">
          created: {trips.created}
        </div>
      </div>
      <div class="tech">
        Tech: {trips.entity_id}
      </div>
      <div class="labor">
        <div class="times flex">
          {#if trips.travel_start_time}
          <div class="due small-txt">Travel In Time: {format(Number(trips.travel_start_time), 'MM/dd/yyyy HH:mm:ss')}</div>
        {/if}
        {#if trips.labor_start_time}
          <div class="due small-txt">Labor In Time: {format(Number(trips.labor_start_time), 'MM/dd/yyyy HH:mm:ss')}</div>
        {/if}
        </div>
        
        <div>Travel Accrued: {trips.labor_travel}</div>
        <div>Labor Accrued: {trips.labor_hours}</div>
      </div>
      <div class="timerButtons">
        {#if trips.travel_start_time === null}
          <button value={trips.data_id} class="update" on:click={startTravel} on:keydown={startTravel}>Start Travel</button>
        {/if}
      
        {#if trips.travel_start_time !== null}
          <button value={trips.data_id} class="update red" on:click={endTravel} on:keydown={endTravel}>End Travel</button>
        {/if}

        {#if trips.labor_start_time === null}
          <button value={trips.data_id} class="update" on:click={startLabor} on:keydown={startLabor}>Start Labor</button>
        {/if}

        {#if trips.labor_start_time !== null}
          <button value={trips.data_id} class="update red" on:click={endLabor} on:keydown={endLabor}>End Labor</button>
        {/if}
      </div>
      <div class="modified">
        id: {trips.data_id} -
        modified: {trips.last_modified}
      </div>
    </div>
  </div>
{/each}
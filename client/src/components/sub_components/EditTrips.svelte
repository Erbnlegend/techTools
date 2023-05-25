<script>
  import trips from "../../stores/trips"
  import { editTrip } from "../../util/submitHours"
  import EditTripForm from "./EditTripForm.svelte"
</script>

{#if $trips.showAll}
  { #each $trips.tripList as trips}
    { #each trips.trips.sort((a, b) => Number(a.data_id) - Number(b.data_id)) as trip}
      <div class="tripsCard">
        <div class="card">
          <div class="title">

            <div class="customer">
              Scheduled: {trip.date_set}
            </div>

            <div class="service">
              Allocated Hours: {trip.allocated_hours}
            </div>

            <div class="created">
              created: {trip.created}
            </div>

          </div>
          <div class="tech">
            Tech: {trip.entity_id}
          </div>

          <div class="labor trip{trip.data_id} show">
            <div>Travel Accrued: {trip.labor_travel}</div>
            <div>Labor Accrued: {trip.labor_hours}</div>
            <button value={trip.data_id} class="update" on:click|preventDefault={editTrip}>Edit Labor</button>
          </div>

          <div id={trip.data_id} class="hide">
            <EditTripForm serviceId={trips} data={trip}/>
          </div>

          <div class="modified">
            id: {trip.data_id} -
            modified: {trip.last_modified}
          </div>
          
        </div>
      </div>
    {/each}
  {/each}
{/if}
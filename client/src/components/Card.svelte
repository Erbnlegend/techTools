<script>
  export let data
  import { CalendarCheck, CheckSquare, UserX } from "lucide-svelte"
  import BatchInfo from "../stores/BatchInfo"
</script>

<div class="card">
  <div>{data.item.company_name} - <span>{data.item.name}</span></div>
  <div class="title">
    <div class="customer">
      {#key data.item.tripsDue.length}
      {#if data.item.status === '6'}
        <p><span></span><CheckSquare class="complete"/></p>
        {:else if data.item.tripsDue.length === 1}
          <p class="due"><span>{data.item.tripsDue.length} Trip! <span class="small"> - {$BatchInfo.date}</span></p>
       {:else if data.item.tripsDue.length >= 2}
          <p class="due"><span>{data.item.tripsDue.length} Trips! <span class="small"> - {$BatchInfo.date}</span></span></p>
      {:else if data.item.status === '1'}
      <p><span></span><UserX class="incomplete"/></p>
      {:else if data.item.status === '2'}
      <p><span></span><CalendarCheck class="assigned"/></p>
      {/if}
      {/key}
    </div>
    <div class="service">
      {data.item.service_order}
    </div>
    <div class="created">
      created: {data.item.date_created}
    </div>
  </div>
  <div class="techList">
    <span>Assigned:</span>
    {#each data.item.tripsDue as trips}
    <p>{trips.entity_id}</p>
    {/each}
  </div>
  <div class="modified">
    <div class="trips">
      Total Trips: {data.item.trips.length}
    </div>
    <p>Created by: {data.item.entity_id}</p>
    modified: {data.item.date_modified}
  </div>
</div>
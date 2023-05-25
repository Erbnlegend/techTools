<script>
  import { submitHours, editTrip } from "../../util/submitHours"
  export let data
  export let serviceId
</script>

<div class="editLabor">
  <form id="tripsForm" on:submit|preventDefault={(e) => {submitHours(e, serviceId.data_id)}}>
    <input name="data_id" class="hide" value={data.data_id} />
    <label for="labor_travel">Travel Accrued: </label>
    <input type="number" name="labor_travel" value={data.labor_travel}>
    <label for="labor_hours">Labor Accrued: </label>
    <input type="number" name="labor_hours" value={data.labor_hours}>
    <button type="submit" value={data.data_id} on:click={editTrip}>Submit</button>
  </form>
</div>
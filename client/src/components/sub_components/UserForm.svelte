<script>
  import { onMount } from 'svelte'
  import user from '../../stores/user'
  import { submitUser, closeForm } from '../../util/submitUser'
  import axios from 'axios'
  import currentMode from '../../util/mode'
  import { X } from 'lucide-svelte'

  const url = currentMode.getMode()
  onMount( async () => {
    try {
      const response = await axios.get(`http://${url}/api/listtechs`)
      user.update(data => {
        return {
          ...data,
          technicians: response.data.technicians
        }
      })
    } catch (error) {
      console.log(error)
    }
  })

</script>

<form id="userForm" on:submit|preventDefault={submitUser}>
  <div class="modal">
    {#if $user.user}
      <div class="userFormMenu">
        <h4>Select a new User</h4>
        <div class="closeForm" on:click={closeForm} on:keydown={closeForm}><X /></div>
      </div>
      {:else}
        <h4>You must select a user first</h4>
    {/if}
    <select id="dropDownList" name="user" required>
      <option disabled>Choose</option>
      {#each $user.technicians as techs}
        <option value={techs.NS_ID}>{techs.entity_id}</option>
      {/each}
    </select>
    <button>Submit</button>
  </div>
</form>
<script>
  export let data
  import toggleDataShown from '../../stores/trips'
  import { slide } from 'svelte/transition'
  import { contactInfo, switchContact } from '../../util/contacts'
  import contact from '../../stores/contact'
  import { onMount } from 'svelte'
  import { ArrowLeftRight } from 'lucide-svelte'

  onMount(() => {
    contact.update(data => {
      return {
        ...data,
        contact: 0,
        selected: false
      }
    })
  })
  
</script>

{#if $toggleDataShown.showSummary}
  <div class="summary" transition:slide|local>
    <p><span>Workflow status: </span> {data.status}</p>
    <!-- <h3><span>Service Owner: </span></h3> {data.entity_id} -->
    {#if !$contact.switch}
      {#if data.contact_selected.length === 1}
        <div class="flex">
          <p><span>Requesting Contact: </span>&nbsp;{data.contact_selected[0].name}<div on:click={switchContact} on:keydown={switchContact}><ArrowLeftRight class="switch"/></div>
        </div>
          <p><span>Email: </span>{data.contact_selected[0].email}</p>
        <p><span>Phone: </span>{data.contact_selected[0].phone}</p>
        {:else}
        <p><span>No Requesting Contact:</span></p>
        <select id="contactList" on:change={contactInfo}>
          {#each data.contacts as contacts, i}
            <option value={i}>{contacts.name}</option>
          {/each}
        </select>
        <p><span>Email:</span> {data.contacts[$contact.contact].email}</p>
        <p><span>Phone:</span> {data.contacts[$contact.contact].phone}</p>
      {/if}
    {/if}
    {#if $contact.switch}
    <p><span>Select new contact</span></p>
    <select id="contactList" on:change={contactInfo}>
      {#each data.contacts as contacts, i}
        <option value={i}>{contacts.name}</option>
      {/each}
    </select>
    <p><span>Email:</span> {data.contacts[$contact.contact].email}</p>
    <p><span>Phone:</span> {data.contacts[$contact.contact].phone}</p>
    {/if}
    
    {#if data.docs === null}
    <p><span>Documentation &#40;Scope of Work&#41;: Not provided</span></p>
      {:else if data.docs !== null}
      <p><span>Documentation &#40;Scope of Work&#41;: </span></p><a href={data.docs} target="_blank">Link to Doc</a>
    {/if}
    <p><span>Address: </span></p>{data.address}
    <p><span>Problem: </span></p> {data.problem}
    <p><span>Short Description: </span></p> {data.short_description}
    <p><span>Summary: </span></p> {data.summary}
    <p><span>Equipment: </span></p> {data.equipment}
  </div>
{/if}
<script>
  export let data
  import { MapPin, PhoneOutgoing, MessageCircle, FileText } from 'lucide-svelte'
  import button from '../util/tripButton'
  import { Link } from 'svelte-navigator'
  import contact from '../stores/contact'
</script>

<div class="buttons">
  <a class="button" href="https://maps.google.com/?q={data.address}" target="_blank" ><MapPin class="icon" />Navigate</a>
  <button class="button" on:click={button.summary} on:keydown={button.summary}><FileText class="icon" /> Summary</button>
  <Link data={data} class="button" to="comments"><MessageCircle class="icon" /> Comments</Link>
  {#if !$contact.selected}
    {#if data.contact_selected.length === 1}
      <a class="button" href='tel:+{data.contact_selected[0].phone}'><PhoneOutgoing class="icon" /> Call</a>
      {:else}
      <a class="button" href='tel:+{data.contacts[$contact.contact].phone}'><PhoneOutgoing class="icon" /> Call</a>
    {/if}
  {/if}

  {#if $contact.selected}
    <a class="button" href='tel:+{data.contacts[$contact.contact].phone}'><PhoneOutgoing class="icon" /> Call</a>
  {/if}
  
</div>
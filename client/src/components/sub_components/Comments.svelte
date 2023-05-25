<script>
  import { Link } from 'svelte-navigator'
  import { ChevronLeft, Plus, PlusCircle, RefreshCw } from 'lucide-svelte'
  export let data
  import comments from '../../stores/comments.js'
  import { onMount } from 'svelte'
  import axios from 'axios'

  import currentMode from '../../util/mode.js'
  import Form from './Form.svelte'
  const url = currentMode.getMode()

  let showform = true

  const formStatus = () => {
    showform = !showform
  }

  window.onbeforeunload = function(){
    return 'Leaving/reloading is not always necessary'
  }

  onMount( async () => {
    try {
      const response = await axios.get(`http://${url}/api/listcomments?serviceId=${data.id}`)
      comments.update(comment => {
        return {
          // need to add files
          ...comment,
          service: data.id,
          comments: response.data.comments,
          technicians: response.data.technicians
        }
      })
    } catch (error) {
      console.log(error)
    }
  })

  const refreshComments = async () => {
    try {
      const response = await axios.get(`http://${url}/api/listcomments?serviceId=${data.id}`)
      comments.update(comment => {
        return {
          ...comment,
          comments: response.data.comments,
          technicians: response.data.technicians
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

</script>

<div class="subNav">
  <Link to='../'><ChevronLeft class="backIcon"/></Link>
  <h1>Comments!</h1>
</div>

<div class="wrapper">
  <div class="commentButtons">
    <div on:click={formStatus} on:keydown={formStatus}>
      <PlusCircle class="add" />
    </div>
    <div on:click={refreshComments} on:keydown={refreshComments}>
      <RefreshCw class="add" />
    </div>
  </div>

  {#if showform}
    <Form />
  {/if}

  {#if $comments.comments.length === 0}
    <div>There are no comments</div>
  {/if}

  {#if $comments.comments.length > 0 }
    {#each [...$comments.comments].reverse() as comment}
      <div class="comments">
        <p class="author">{comment.entity_id} - {comment.date }</p>
        <p class="comment">{comment.comment}</p>
        <div class="imagesContainer">
          {#if comment.file_name.length > 0}
            {#each comment.file_name as file}
              <a href='{comment.path}/files/{file}' target="_blank">
                <img class="commentImages" src='{comment.path}/files/{file}' alt={file}/>
              </a>
            {/each}
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>

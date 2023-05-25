<script>
// @ts-nocheck

  import comments from "../../stores/comments"
  import currentMode from '../../util/mode.js'

  import { submitComment } from "../../util/submitComment"
  import { handleDrop, handleDragover, handlePaste, handleDragleave, handleSelect } from "../../util/makeFile"
  import { X, Plus } from "lucide-svelte"

  const url = currentMode.getMode()

</script>

<div class="form">
  <form enctype="multipart/form-data" id="inputForm" on:submit|preventDefault={submitComment}>
    <input
      type="text"
      id="comment"
      name="comment"
      value=""
      placeholder="type, paste or drop"
      minlength="5"
      on:drop|preventDefault={handleDrop}
      on:dragover|preventDefault={handleDragover}
      on:dragleave|preventDefault={handleDragleave}
      on:paste|preventDefault={handlePaste}
    />
    <label class="addFiles" for="files"><Plus></Plus>Add Files</label>
    <input
      multiple
      type="file"
      id="files"
      name="files"
      on:change|preventDefault={handleSelect}
    />
    <div id="commentInput">
      {#each $comments.files as files, i}
        <p>{i + 1}. {files.name} <X class="delete"/></p>
      {/each}
    </div>
    <button>Submit</button>
  </form>
</div>
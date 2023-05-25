<script>
  import { Link } from "svelte-navigator"
  import { Menu } from "lucide-svelte"
  import { resetUser } from "../util/resetUser"
  import { showMenu } from "../util/showMenu"
</script>

<nav>
  <!-- <Link to="/">Home</Link> -->
  <Link class="mainNav" to="/">Services</Link>
  <div class="menu" on:click={showMenu} on:keydown={showMenu}>
    <Menu/>
  </div>
  <div class="hiddenMenu hide">
    <ul class="insideMenu">
      <Link to="/" on:click={showMenu} on:keydown={showMenu} ><li>Services</li></Link>
      <li on:click={() => {resetUser(), showMenu()}} on:keydown={() => {resetUser(), showMenu()}}>Reset User</li>
    </ul>
  </div>
</nav>

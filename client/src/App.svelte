<script>
  import { Router, Route } from "svelte-navigator"
  import { userSelect } from "./util/userSelect"
  import Services from "./routes/Services.svelte"
  import Nav from "./components/Nav.svelte"
  import Footer from "./components/Footer.svelte"
  import Trips from "./routes/Trips.svelte"
  import Comments from "./components/sub_components/Comments.svelte"
  import user from "./stores/user"
  import UserForm from "./components/sub_components/UserForm.svelte"

  userSelect()

</script>

  <Router basepath='/'>
    <main>
    <!-- <Route path="/login"><Login /></Route> -->
      <header>
        <Nav />
      </header>
      {#if $user.showUserForm}
        <UserForm />
      {/if}
      <!-- <Route path="/" primary={false}><Home /></Route> -->

      <Route primary={false} component={Services}></Route>

      <Route path="/" primary={false}><Services /></Route>

      <Route path="trips/:id" let:params primary={false}><Trips data={params} /></Route>

      <Route path="trips/:id/comments" let:params primary={false}><Comments data={params}/></Route>

      <Footer />
    </main>
  </Router>

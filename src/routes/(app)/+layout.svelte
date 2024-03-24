<script>
  import "../../app.css";
  import {page} from "$app/stores"
  import{Button, Navbar,NavBrand,NavUl,NavLi,NavHamburger} from 'flowbite-svelte'
  import Logo from "$lib/assets/logo_light.png"

    $: activeUrl = $page.url.pathname;
</script>

<header>
  <a href="/">
  </a>
  
  <div>
  </div>
  
</header>

<Navbar>
  <NavBrand href="/">
    <img src={Logo} class="me-3 h-6 sm:h-9" alt="BERC Logo" />
  </NavBrand>
  <div class="flex md:order-2 gap-1">
    <div>
      <a href="/auth/login">
        <Button size='sm' color="purple">Sign in</Button>
      </a>
      <a href="/auth/signup">
        <Button size='sm' color='light'>Get Started</Button>
      </a>
    </div>
    <NavHamburger />
  </div>
  <NavUl class="order-1" {activeUrl}>
    <NavLi href="/">Home</NavLi>
    <NavLi href="#">Job vacancies</NavLi>
    <NavLi href="#">Candidate pool</NavLi>
    <NavLi href="#">About</NavLi>
  </NavUl>
</Navbar>


<slot />
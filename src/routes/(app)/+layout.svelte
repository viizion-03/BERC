<script>
	import '../../app.css';
	import { page } from '$app/stores';
	import { Button, Navbar, NavBrand, NavUl, NavLi, NavHamburger } from 'flowbite-svelte';
	import Logo from '$lib/assets/logo_light.png';
	import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	export let data;

	const { user, userProfile } = data;

	$: activeUrl = $page.url.pathname;
</script>

<div class="bg-orange-100 h-svh overflow-y-auto flex flex-col">
	<Navbar class="white ">
		<NavBrand href="/">
			<img src={Logo} class="me-3 h-6 sm:h-9" alt="BERC Logo" />
		</NavBrand>

		{#if data.user}
			<div class="flex md:order-2 gap-1">
				<Button color="none">
					{data.user.name ? data.user.name : data.user.email}

					<ChevronDownOutline class="size-5 ms-2 text-orange-600 dark:text-white" /></Button
				>
				<Dropdown>
					<div slot="header" class="px-4 py-2">
						{#await userProfile then p}
							{#if 'doc' in p}
								<span class="block text-sm text-gray-900 dark:text-white"
									>{p?.doc.firstname} {p?.doc.surname}</span
								>
								<span class="block truncate text-sm font-medium">{data.user.email}</span>
							{/if}
						{/await}
					</div>
					<DropdownItem href="/account">Dashboard</DropdownItem>
					<DropdownItem>Chats</DropdownItem>
					<DropdownItem>My Organizations</DropdownItem>
					<DropdownItem href="/account/vacancies">My Vacancies</DropdownItem>
					<DropdownItem>Vacancy Applications</DropdownItem>
					<DropdownItem>My Forums</DropdownItem>

					<DropdownItem slot="footer">
						<form action="/account?/logout" method="post">
							<Button type="submit" class="w-full">Sign Out</Button>
						</form>
					</DropdownItem>
				</Dropdown>
				<NavHamburger />
			</div>
		{:else}
			<div class="flex md:order-2 gap-1">
				<div>
					<a href="/auth/login">
						<Button size="sm" color="purple">Sign in</Button>
					</a>
					<a href="/auth/signup">
						<Button size="sm" color="light">Get Started</Button>
					</a>
				</div>
				<NavHamburger />
			</div>
		{/if}
		<NavUl class="order-1" {activeUrl}>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/vacancies">Job vacancies</NavLi>
			<NavLi href="#">Candidate pool</NavLi>
			<NavLi href="/about">About</NavLi>
		</NavUl>
	</Navbar>

	<div class="flex-grow">
		<slot />
	</div>
</div>

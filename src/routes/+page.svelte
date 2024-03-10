<script>
	import { Heading, P, Button } from 'flowbite-svelte';
	import { AuthService } from '$lib/appwrite';
	import { onMount } from 'svelte';

	const auth = new AuthService();

	function handleClick() {
		auth
			.deleteAllSessions()
			// .emailLogin('test@gmail.com', 'password123')
			// .updateEmail("random@gmail.com", "password122")
			// .createAccount('test', 'test@gmail.com', 'password123', 'BW2590081')
			.then((res) => console.log(res));
	}
	/**
	 * @type {import("appwrite").Models.User<import("appwrite").Models.Preferences> | null}
	 */
	let user;
	

	onMount(async () => {
		auth
			.getUser()
			.then((usr) => (user = usr))
			.catch((err) => console.log({err}));
	});
</script>

<div class="text-center">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>We invest in the world’s potential</Heading
	>
	<P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
		>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
		long-term value and drive economic growth.</P
	>

	<div>
		{#if user}
			<h1>{user.name} in the Inside</h1>
		{:else}
			<code>No User Logged In</code>
		{/if}
	</div>
	<Button on:click={handleClick}>Learn more</Button>
</div>

<script>
	import { Heading, P, Button } from 'flowbite-svelte';
	import { AuthService } from '$lib/appwrite';
	import { onMount } from 'svelte';

	const auth = new AuthService();

	function handleClick() {
		auth
			// .deleteAllSessions()
			.emailLogin('bigboi@gmail.com', 'password123')
			// .updateEmail("test@gmail.com", "password123")
			// .createAccount('bigboi', 'bigBoi@gmail.com', 'password123', 'BW2590082')
			.then((res) => console.log(res));
	}

	/**
	 * @type {import("appwrite").Models.User<import("appwrite").Models.Preferences> | null}
	 */
	let currentUser;

	onMount(async () => {
		auth
			.getUser()
			.then(({ user }) => {
				currentUser = user;
			})
			.catch((err) => console.log({ err }));
	});
</script>

<div class="text-center bg-green-500 font-semibold py-2">
	{#if currentUser}
		<h1>{currentUser.email} in the Inside</h1>
	{:else}
		<code>No User Logged In</code>
	{/if}
</div>
<div class="text-center">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>We invest in the world’s potential</Heading
	>
	<P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
		>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
		long-term value and drive economic growth.</P
	>
	<Button
		on:click={() => {
			// auth.sendPasswordRecovery("resag17615@mcuma.com", "http://localhost:5173").then((res) => console.log(res));
			auth.getSession('current').then(res => console.log(res))
			// auth.logout('current').then(res => console.log(res))
		}}>Test Function</Button
	>
</div>

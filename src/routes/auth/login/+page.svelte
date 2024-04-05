<script>
	import { superForm } from 'sveltekit-superforms/client';
	import { Input, Button, Label, Checkbox, Helper, Alert,Spinner } from 'flowbite-svelte';
	import Art from '$lib/assets/login_art.jpg';
	import Logo from '$lib/assets/logo_light.png';

	export let data;
	const { form, errors, enhance } = superForm(data.form);

	let awaitingLogin = false;
</script>

<div class="flex gap-4 h-svh items-center bg-gradient-to-bl bg-slate-500">
	<div class="flex flex-grow justify-center">
		<form use:enhance method="post" class="bg-white shadow-xl p-6 rounded-md border lg:w-1/4" on:submit={() => awaitingLogin=true}>
			<div class="flex gap-2 object-contain mb-5 justify-center">
				<a href="/">
					<img src={Logo} alt="BERC logo" class="w-72 object-cover border-b-2" />
				</a>
			</div>

            
			<div class="text-center mb-6">
                <h2 class="text-2xl font-semibold mb-2">Login</h2>
				<p>Enter your credentials to login into your account</p>
			</div>
            {#if ($errors._errors)}
            <Alert color='red' class="mb-5">
                {$errors._errors[0]}
            </Alert>
            {/if}
            
			<div class="mb-4">
                <Label for="email" class="mb-2">Email address</Label>
				<Input
					type="email"
					id="email"
					name="email"
					placeholder="John@example.com"
					bind:value={$form.email}
				/>
				<Helper color="red">{$errors.email ? $errors.email : ''}</Helper>
			</div>

			<div class="mb-4">
				<Label for="password" class="mb-2">Password</Label>
				<Input type="password" id="password" name="password" bind:value={$form.password} />
				<Helper color="red">{$errors.password ? $errors.password : ''}</Helper>
			</div>

			<div class="mb-6">
				<p class="mb-3 text-center">
					Don't have an account? <a href="/auth/signup" class="text-blue-400 underline">sign up</a>
				</p>
				<!-- <Checkbox name="rememberMe" bind:checked={$form.rememberMe}>Remember Me</Checkbox> -->
			</div>

			{#if awaitingLogin}
			<Button disabled class='w-full'>
				<Spinner size={4} />
			</Button>
			{:else}
			<Button class="w-full" type="submit">Sign in</Button>
			{/if}

		</form>
	</div>
	<!-- <img src={Art} alt="Page Art" class="opacity-80 md:absolute md:right-0 hidden md:block ms-auto w-3/12 h-full" /> -->
</div>

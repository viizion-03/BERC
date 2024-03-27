<script>
	import { countries } from '$lib/constants.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input, Button, Label, Select, Helper } from 'flowbite-svelte';
	import Logo from '$lib/assets/logo_dark.png';

	export let data;
	const { form, errors, enhance } = superForm(data.form, { validationMethod: 'onblur' });
</script>

<div class="flex flex-col gap-4 h-svh items-stretch bg-gradient-to-bl bg-slate-500">
	<div class="flex justify-center mt-5">
        <a href="/">
            <img src={Logo} alt="BERC logo" class="w-72 object-cover" />
        </a>
	</div>
	<div class="flex justify-center">
		<form method="post" class="bg-white shadow-xl p-6 rounded-md border lg:w-2/6">
			<!-- <div class="flex gap-2 object-contain mb-5 justify-center">
            </div> -->
			<div class="text-center mb-6">
				<h2 class="text-2xl font-semibold mb-2">Create Account</h2>
				<p>Kindly fill in your details to create your account</p>
			</div>

			<div class="md:grid md:grid-cols-2 md:gap-3">
				<div class="mb-4">
					<Label for="firstname" class="mb-2">Firstname</Label>
					<Input type="text" id="firstname" name="firstname" bind:value={$form.firstname} />
					<Helper color="red">{$errors.firstname ? $errors.firstname : ''}</Helper>
				</div>
				<div class="mb-4">
					<Label for="surname" class="mb-2">Surname</Label>
					<Input type="text" id="surname" name="surname" bind:value={$form.surname} />
					<Helper color="red">{$errors.surname ? $errors.surname : ''}</Helper>
				</div>
			</div>
			<div class="mb-4">
				<Label for="omangPassport" class="mb-2">Omang/Passport #</Label>
				<Input
					type="text"
					id="omangPassport"
					name="omangPassport"
					bind:value={$form.omangPassport}
				/>
				<Helper color="red">{$errors.omangPassport ? $errors.omangPassport : ''}</Helper>
			</div>

			<div class="md:grid md:grid-cols-2 md:gap-3 mb-2">
				<div class="mb-4">
					<Label for="dob" class="mb-2">Date of Birth</Label>
					<Input type="date" id="dob" name="dob" bind:value={$form.dob} />
					<Helper color="red">{$errors.dob ? $errors.dob : ''}</Helper>
				</div>

				<div class="mb-4">
					<Label for="nationality" class="mb-2">Nationality</Label>
					<Select name="nationality" items={countries} bind:value={$form.nationality}></Select>
				</div>
			</div>
			<hr class="mb-4" />
			<div class="md:grid md:grid-cols-2 md:gap-3 mb-6">
				<div>
					<Label for="username" class="mb-2">Username</Label>
					<Input
						type="text"
						id="username"
						name="username"
						bind:value={$form.username}
					/>
					<Helper color="red">{$errors.username ? $errors.username : ''}</Helper>
				</div>
				<div>
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
			</div>

			<div class="md:grid md:grid-cols-2 md:gap-3 mb-6">
				<div class="mb-4">
					<Label for="password" class="mb-2">Password</Label>
					<Input type="password" id="password" name="password" bind:value={$form.password} />
					<Helper color="red">{$errors.password ? $errors.password : ''}</Helper>
				</div>

				<div class="mb-4">
					<Label for="confirmPassword" class="mb-2">Confirm Password</Label>
					<Input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						bind:value={$form.confirmPassword}
					/>
					<Helper color="red">{$errors.confirmPassword ? $errors.confirmPassword : ''}</Helper>
				</div>
			</div>

			<p class="mb-3 text-center">
				Already have an account? <a href="/auth/login" class="text-blue-400 underline">Login</a>
			</p>
			<Button class="w-full" type="submit">Create Account</Button>
		</form>
	</div>
	<!-- <img src={Art} alt="Page Art" class="opacity-80 md:absolute md:right-0 hidden md:block ms-auto w-3/12 h-full" /> -->
</div>

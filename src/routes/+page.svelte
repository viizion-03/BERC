<script>
	import { Heading, P, Button, Input, Fileupload } from 'flowbite-svelte';
	import { AuthService, StorageService } from '$lib/appwrite';
	import { UserProfileService, MessageService } from '$lib/backend-services';
	import { onMount } from 'svelte';

	/**
	 * @type {import("appwrite").Models.User<import("appwrite").Models.Preferences> | null}
	 */
	let currentUser;

	onMount(async () => {
		currentUser = await new AuthService().getUser().then((res) => res.user);
	});

	/**
	 * @type {any}
	 */
	let uploaderFiles;
	let messageText = '';
	let uploader;
	let fileLink;
</script>

{#if currentUser}
	<div class="text-center">
		<h1>{currentUser.email}</h1>
	</div>
{/if}

<div class="text-center">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>We invest in the world’s potential</Heading
	>
	<P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
		>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
		long-term value and drive economic growth.</P
	>
	<div>
		<Input type="text" placeholder="message" bind:value={messageText} />
		<!-- <Input type="file" bind:files={uploaderFiles} id="media" /> -->
		<Fileupload bind:files={uploaderFiles} />
	</div>

	<Button
		on:click={() => {
			// const messageService = new MessageService('text', currentUser?.$id, '65f4ff9a30c20a601259');

			// if (uploaderFiles)
			// 	messageService
			// 		.createUpload( uploaderFiles[0],messageText)
			// 		.then((res) => console.log(res));
			// else {
			// 	messageService
			// 		// .create({ text: messageText, type: messageService.requiredAttributes.type, senderProfile: currentUser?.$id, chatRoom: '65f4ff9a30c20a601259' })
			// 		.create({ text: messageText})
			// 		.then((res) => console.log(res));
			// }

			new UserProfileService('GH341304921', 'Waid', 'Maloney', '06/30/1992', 'Zambia')
				.signUp('WAIDE', 'waide@vmail.com', 'password123')
				.then((res) => console.log(res));

			// const profile = new UserProfileService(currentUser?.$id, "Omon", "Rizu","02/11/2001", "Botswana" );
			// profile.create({...profile.requiredAttributes}, currentUser?.$id).then(res => console.log(res))
			// messageService.list().then((res) => console.log(res));
		}}>Send Message</Button
	>
</div>

<script>
	import { Heading, P, Button, Input, Fileupload, Spinner } from 'flowbite-svelte';
	import { AuthService, StorageService } from '$lib/appwrite';
	import * as s from '$lib/backend-services';
	import { onMount } from 'svelte';
	import { Locale } from 'appwrite';

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
	let recordId = '65f913706e4db3a2b09a';

	$: service = new s.ForumCommentService('This is an L take', recordId, currentUser?.$id)
	const handleCreate = async () => {
		service.create().then((res) => {
			console.log(res);
			if ('doc' in res) recordId = res.doc.$id;
		});
	};
	const handleUpdate = async () => {
		service.setData({likes: 100});
		service.update(recordId).then((res) => console.log(res));
	};
	const handleDelete = async () => {
		// service.uploadMedia(uploaderFiles, recordId,'image').then(res => console.log(res))
		service.addLike(recordId).then(res => console.log(res))
	};
</script>

<!-- {#if currentUser}
{/if} -->

{#await currentUser}
	<Spinner />
{:then user}
	<div class="text-center bg-blue-900 text-white">
		<h1>{user?.email}</h1>
	</div>
{/await}

<div class="text-center">
	<div>
		<div class="flex justify-center">
			<img
				src="https://i0.wp.com/laviasco.com/wp-content/uploads/2023/06/gunna-fukumean-lyrics-meaning.jpg?w=1920&ssl=1"
				class="size-64 object-cover"
				alt="Ride on a liq"
			/>
		</div>
		<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
			>Fxck You Mean!?</Heading
		>
		<P class="mb-6 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
			>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
			long-term value and drive economic growth.</P
		>
		<div>
			<Input type="text" placeholder="message" bind:value={messageText} />
			<!-- <Input type="file" bind:files={uploaderFiles} id="media" /> -->
			<Fileupload bind:files={uploaderFiles} multiple />
		</div>
	</div>

	<Button on:click={handleCreate}>Create</Button>
	<Button on:click={handleUpdate}>Update</Button>
	<Button on:click={handleDelete}>Delete</Button>
</div>

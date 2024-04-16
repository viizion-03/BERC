<script>
	import { Button, Spinner } from 'flowbite-svelte';
	export let isPosting = false;
	export let text;
	export let postingText;
	export let isFullWidth = true;
</script>

<div class="w-full">
	{#if isPosting}
		<Button type="submit" disabled class="disabled {isFullWidth ? 'w-full' : 'max-w-72'} mx-auto"
			>{postingText} <Spinner size={3} class="ms-3" /></Button
		>
	{:else}
		<Button type="submit" class=" {isFullWidth ? 'w-full' : 'max-w-72'} mx-auto">{text}</Button>
	{/if}
</div>

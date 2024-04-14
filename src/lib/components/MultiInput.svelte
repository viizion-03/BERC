<script>
	import { Input } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	export let array;
	/**
	 * @type {string}
	 */
	export let name;
	export let placeholder = 'Press enter after each item';
	export let pattern = '.+';
	export let defaultInput = '';
	export let type = 'text';
	export let newLine = false
	let input = defaultInput;
	let emailInput;
</script>

<div class="flex {newLine ? 'flex-col-reverse' : ''} border border-gray-300 rounded-lg bg-slate-50 mt-2">
	<div class="flex {newLine ? 'overflow-auto' : ''}">
		{#each array as n}
			<div class="flex items-center bg-white gap-1 border m-1 py-1 rounded-md px-2">
				<span class="text-sm">{n}</span>
				<CloseOutline
					size="xs"
					on:click={() => {
						array = array.filter((x) => x !== n);
					}}
				/>
			</div>
		{/each}
	</div>
	{#each array as v}
		<input type="hidden" {name} id={name} value={v} />
	{/each}

	{#if type === 'text'}
		<Input
			bind:pattern
			type="text"
			{placeholder}
			class="border-none outline-none"
			bind:value={input}
			on:keydown={(e) => {
				if (e.key === 'Enter' && input) {
					e.preventDefault();
					array = [...array, input];
					input = defaultInput;
				}
			}}
		/>
	{:else if type === 'email'}
		<Input
			bind:pattern
			bind:this={emailInput}
			type="email"
			{placeholder}
			class="border-none outline-none"
			bind:value={input}
			on:keydown={(e) => {
				if (e.key === 'Enter' && input) {
					e.preventDefault();
					console.log(emailInput);
					array = [...array, input];
					input = defaultInput;
				}
			}}
		/>
	{/if}
</div>

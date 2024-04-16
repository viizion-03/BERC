<script>
	import { Label, Input, Helper, Button, Listgroup } from 'flowbite-svelte';
	import { PlusOutline, CloseCircleOutline } from 'flowbite-svelte-icons';

	/**
	 * @type {string}
	 */
	export let title;
	/**
	 * @type {string[]}
	 */
	export let propertyArray = [];
	// export let propertyError;
	/**
	 * @type {string}
	 */
	let property;
	export let placeholder ='Type and press enter to add'
</script>

<div>
	<Label for="" class="mb-2">{title}</Label>
	<div class="flex items-center">
		<Input
			class="rounded-e-none"
			type="text"
			placeholder={placeholder}
			bind:value={property}
			on:keydown={(e) => {
				if (e.key === 'Enter' && property) {
					e.preventDefault();
					propertyArray = [...propertyArray, property];
					property = '';
				}
			}}
		/>
		<Button
			class="rounded-s-none"
			on:click={() => {
				if (property) {
					propertyArray = [...propertyArray, property];
					property = '';
				}
			}}
		>
			<PlusOutline />
			Add</Button
		>
	</div>
	<!-- <Helper color="red">{propertyError ? propertyError : ''}</Helper> -->

	<div class="flex gap-2 max-h-40 overflow-y-hidden mt-4">
		<div class="w-full">
			{#if propertyArray?.length > 0}
				<h3 class=" text-xs mb-2 underline">{title}</h3>
				<div class="overflow-y-auto max-h-40">
					<Listgroup active items={propertyArray} let:item class="w-full" on:click={console.log}>
						<span class='text-xs'>
							{item}
						</span>
						<CloseCircleOutline
							class="ms-auto"
							on:click={() => {
								propertyArray = propertyArray.filter((x) => x !== item);
							}}
						/>
					</Listgroup>
				</div>
			{/if}
		</div>
	</div>
</div>

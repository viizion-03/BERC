<script>
	import { Card, Listgroup, ListgroupItem } from 'flowbite-svelte';
    import {}

    export let educationModal;
    export let form;
</script>

<Card size="none">
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		Professional Bio
	</h5>
	<!-- <div class="mb-4">
						<Label for="occupation" class="mb-2">Occupation</Label>
						<Input type="text" id="occupation" name="occupation" bind:value={$form.Occupation} />
						<Helper color="red">{$errors.Occupation ? $errors.Occupation : ''}</Helper>
					</div> -->

	<div class="flex justify-between items-center mb-5">
		<h4>Educations</h4>
		<Button on:click={() => (educationModal = true)}>Add an Education</Button>
	</div>

	<Listgroup>
		{#if $form.userBiography.educations}
			{#each $form.userBiography.educations as ed, i (ed.$id)}
				<ListgroupItem class="flex items-start">
					<div class="flex-grow">
						<p>{ed.qualification}</p>
						<p>{ed.institution}</p>
						<p>{ed.startDate} - {ed.endDate ? ed.endDate : 'Present'}</p>

						{#if ed.certificateSID}
							<a
								href={new StorageService().getFileView('certificates', ed.certificateSID).url}
								target="_blank"
							>
								<img
									src={new StorageService().getFilePreview('certificates', ed.certificateSID).url}
									alt="Certificate Link"
									class="w-14 rounded-md"
								/>
							</a>
						{/if}
					</div>
					<form action="?/deleteEducation" method="post" use:enhance>
						<Button color="dark" class="px-3">
							<TrashBinSolid />
						</Button>
					</form>
				</ListgroupItem>
			{/each}
		{/if}
	</Listgroup>
</Card>

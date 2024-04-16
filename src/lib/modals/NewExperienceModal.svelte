<script>
	import { Modal, Input, Helper, Button, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import ArrayInput from '$lib/components/ArrayInput.svelte';
	import { handleFormToast } from '$lib/helper-functions';
	import FormButton from '$lib/components/FormButton.svelte';
	export let data;
	export let expList;
	export let experienceModal;
	export let biographyId;

	const { form, errors, constraints, enhance } = superForm(data.experienceForm, {
		dataType: 'json',
		invalidateAll: false,
		onUpdated({ form: f }) {
			isPosting = false;
			if (f.message?.res?.doc) {
				expList = [...expList, f.message.res.doc];
				experienceModal = false;
			}
			handleFormToast(f);
		}
	});

	$form.userBiography = biographyId;

	let isPosting = false;
</script>

<Modal id="experience-modal" bind:open={experienceModal}>
	<form
		action="?/addExperience"
		method="post"
		use:enhance
		class="flex flex-col gap-4"
		on:submit={() => (isPosting = true)}
	>
		<h3 class="text-center text-lg font-semibold">Add Work Experience to Portfolio</h3>
		<div>
			<Input
				type="text"
				id="occupation"
				name="occupation"
				bind:value={$form.occupation}
				placeholder="E.g Chief Executive Officer"
			/>
			<Helper color="red">{$errors.occupation ? $errors.occupation : ''}</Helper>
		</div>
		<div>
			<Input
				type="text"
				id="organization"
				name="organization"
				bind:value={$form.organization}
				placeholder="Organization Name"
			/>
			<Helper color="red">{$errors.organization ? $errors.organization : ''}</Helper>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label for="startDate">Start Date</Label>
				<Input type="date" name="startDate" bind:value={$form.startDate} />
				<Helper color="red">{$errors.startDate ? $errors.startDate : ''}</Helper>
			</div>

			<div>
				<Label for="endDate">End Date</Label>
				<Input type="date" name="endDate" bind:value={$form.endDate} />
				<Helper color="red">{$errors.endDate ? $errors.endDate : ''}</Helper>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<ArrayInput bind:propertyArray={$form.achievments} title="Achievements" />
			<ArrayInput bind:propertyArray={$form.skillsAquired} title="Skills Acquired" />
		</div>

		<input type="hidden" name="biographyId" bind:value={$form.userBiography} />
		<!-- <Button type="submit" class='mt-5'>Add Experience</Button> -->
		<FormButton text="Add Experience" postingText="Adding to portfolio" bind:isPosting />
	</form>
</Modal>

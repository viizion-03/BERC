<script>
	import {
		Label,
		Input,
		Helper,
		Button,
		Modal,
		Spinner,
		FloatingLabelInput,
		Checkbox,
		Fileupload
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { StorageService } from '$lib/services/appwrite';
	export let data;

	const {
		form: edForm,
		errors: edErrors,
		message: edMessage,
		constraints: edConstraints,
		enhance: edEnhance
	} = superForm(data.educationForm, {
		validationMethod: 'onsubmit',
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message && form.message.type) {
				switch (form.message.type) {
					case 'success':
						toast.success(form.message.text ? form.message.text : 'Submission Successfull');

						// console.log(form)
						edList = [...edList, form.message.res.doc];
						// reset the fields in the form and close the modal
						$edForm.certificateSID = '';
						$edForm.endDate = '';
						$edForm.startDate = '';
						$edForm.qualification = '';
						$edForm.institution = '';
						$edForm.isSuccessfullyCompleted = false;
						educationModal = false;

						break;
					case 'error':
						toast.error(
							form.message.text ? form.message.text : 'Invalid input(s), submission failed'
						);
						break;
				}
			}
			postingEdModal = false;
		}
	});

	//MODAL VALUES
	export let educationModal = true;
	let educationFiles;
	let postingEdModal = false;
	let edCertificateUploading = false;
	export let edList;
	$edForm.userBiography = data.user.$id;

</script>

<Modal bind:open={educationModal} id="add-education-modal">
	<h5>Add an Education (Certification)</h5>
	<form
		method="post"
		action="/account/profile?/addEducation"
		use:edEnhance
	>
		<div>
			<FloatingLabelInput
				style="outlined"
				id="qualification"
				name="qualification"
				type="text"
				bind:value={$edForm.qualification}
			>
				Qualification Name
			</FloatingLabelInput>
			<Helper color="red">{$edErrors.qualification ? $edErrors.qualification : ''}</Helper>
		</div>
		<div>
			<FloatingLabelInput
				style="outlined"
				id="institution"
				name="institution"
				type="text"
				bind:value={$edForm.institution}
			>
				Institution
			</FloatingLabelInput>
			<Helper color="red">{$edErrors.institution ? $edErrors.institution : ''}</Helper>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label for="startDate">Start Date</Label>
				<Input type="date" name="startDate" bind:value={$edForm.startDate} />
				<Helper color="red">{$edErrors.startDate ? $edErrors.startDate : ''}</Helper>
			</div>

			<div>
				<Label for="endDate">End Date</Label>
				<Input
					type="date"
					name="endDate"
					bind:value={$edForm.endDate}
					on:input={() => {
						if ($edForm.endDate) $edForm.isSuccessfullyCompleted = true;
					}}
				/>
			</div>
			<button type="button" on:click={() => console.log(educationFiles)}>Show uploader</button>
		</div>

		<Checkbox name="isSuccessfullyCompleted" bind:checked={$edForm.isSuccessfullyCompleted}>
			Successfully completed
		</Checkbox>

		{#if $edForm.isSuccessfullyCompleted}
			<Label class="space-y-2 mb-2">
				<span>Upload Certificate</span>
				<Fileupload
					bind:value={$edForm.certificateSID}
					bind:files={educationFiles}
					on:change={(e) => {
						edCertificateUploading = true
						const store = new StorageService();
						if (!$edForm.certificateSID) {
							store
								.create('certificates', e.target.files[0])
								.then((res) => {
									if ('file' in res) $edForm.certificateSID = res.file.$id;
									else toast.error('Failed to upload certificate')
								})
								.finally(() => (edCertificateUploading = false));
						} else {
							store.delete('certificates', $edForm.certificateSID);
							store
								.create('certificates', e.target.files[0])
								.then((res) => {
									if ('file' in res) $edForm.certificateSID = res.file.$id;
									else toast.error('Failed to upload certificate')
								})
								.finally(() => (edCertificateUploading = false));
						}
					}}
				/>
			</Label>
		{/if}


		<input type="hidden" name='userBiography' bind:value={$edForm.userBiography}>
		{#if postingEdModal || edCertificateUploading}
			<Button type="button" class="flex items-center gap-1" disabled
				>{postingEdModal ? 'Posting education' : 'Uploading Certificate'}
				<Spinner size={4} /></Button
			>
		{:else}
			<Button
				type="submit">Add education</Button
			>
		{/if}
	</form>
</Modal>

<script>
	import {
		Listgroup,
		ListgroupItem,
		Badge,
		Select,
		Card,
		Label,
		Input,
		Helper,
		Button,
		Modal,
		Radio,
		Alert,
		Spinner,
		FloatingLabelInput,
		Checkbox,
		Popover,
		Fileupload
	} from 'flowbite-svelte';
	import { PlusOutline, InfoCircleSolid, CloseOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';
	import MultiInput from '$lib/components/MultiInput.svelte';
	import { getDatePickerValue } from '$lib/helper-functions.js';
	import toast, { Toaster } from 'svelte-french-toast';
	import { countries, districts } from '$lib/constants.js';
	import { StorageService } from '$lib/services/appwrite';
	import NewEducationModal from '$lib/modals/NewEducationModal.svelte';
	export let data;
	const { profile } = data;

	const { form, errors, message, constraints, enhance } = superForm(data.profileForm, {
		validationMethod: 'onblur',
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message && form.message.type) {
				switch (form.message.type) {
					case 'success':
						toast.success('Submission Successfull');
						break;
					case 'error':
						toast.error('Invalid input(s), submission failed');
						break;
				}
			}
		}
	});

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
	let languageOptions = [
		'English',
		'Setswana',
		'Kalanga',
		'French',
		'Spanish',
		'Mandarin (Chinese)'
	];
	let languageModal = false;
	let educationModal = true;
	let educationFiles = [];
	let postingEdModal = false;
	let educationForm;

	let langObj = {
		language: '',
		proficiency: 'Beginner',
		years: 0
	};

	let educationObj = {
		qualification: '',
		institution: '',
		startDate: '',
		endDate: '',
		completedSuccessfully: false
	};

	profile.then((res) => {
		if ('doc' in res) {
			$form.middleNames = res.doc.middleNames;
			$form = res.doc;
			$form.dob = getDatePickerValue($form.dob);
			if (!$form.district) $form.district = '';
			if (!$form.location) $form.location = '';
			console.log(res.doc.userBiography.educations[0]);
		}
	});

	$: district = districts.filter((d) => d.value === $form.district)[0];
</script>

<Toaster />

<NewEducationModal bind:data bind:educationModal />
<!-- <div class="sticky top-0">
	<SuperDebug data={$form.userLanguages} />
</div> -->
{#await profile}
	<code>Loading Profile Data</code>
{:then p}
	{#if 'doc' in p}
		<form method="post" use:enhance action="?/updateProfile">
			<div class="px-8 py-5 flex flex-col gap-y-5">
				<Card size="">
					<h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Personal Information
					</h2>

					<div class="grid grid-cols-3 gap-4">
						<div class="mb-4">
							<Label for="firstname" class="mb-2">Firstname</Label>
							<Input type="text" id="firstname" name="firstname" bind:value={$form.firstname} />
							<Helper color="red">{$errors.firstname ? $errors.firstname : ''}</Helper>
						</div>

						<div class="mb-4">
							<Label>Middle names</Label>
							<MultiInput bind:array={$form.middleNames} name="middleNames" />
						</div>
						<div class="mb-4">
							<Label for="surname" class="mb-2">Surname</Label>
							<Input type="text" id="surname" name="surname" bind:value={$form.surname} />
							<Helper color="red">{$errors.surname ? $errors.surname : ''}</Helper>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-4">
						<div class="mb-4">
							<Label for="dob" class="mb-2">Date of Birth</Label>
							<Input type="date" id="dob" name="dob" bind:value={$form.dob} />
							<Helper color="red">{$errors.dob ? $errors.dob : ''}</Helper>
						</div>
						<div class="mb-4">
							<Label for="nationality" class="mb-2">Nationality</Label>
							<Select
								name="nationality"
								items={countries}
								bind:value={$form.nationality}
								placeholder="Select a nationality"
							/>
							<Helper color="red">{$errors.nationality ? $errors.nationality : ''}</Helper>
						</div>
						<div class="mb-4">
							<Label for="sex">Sex</Label>
							<div class="flex gap-2 mt-3">
								<Radio bind:group={$form.sex} name="sex" value="male">Male</Radio>
								<Radio bind:group={$form.sex} name="sex" value="female">Female</Radio>
								<Radio bind:group={$form.sex} name="sex" value="other">Other</Radio>
							</div>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="mb-4">
							<Label for="occupation" class="mb-2">Occupation</Label>
							<Input type="text" id="occupation" name="occupation" bind:value={$form.Occupation} />
							<Helper color="red">{$errors.Occupation ? $errors.Occupation : ''}</Helper>
						</div>
						<div class="mb-4">
							<Label for="currentCompany" class="mb-2">Current work company</Label>
							<Input
								type="text"
								id="currentCompany"
								name="currentCompany"
								bind:value={$form.currentCompany}
							/>
							<Helper color="red">{$errors.currentCompany ? $errors.currentCompany : ''}</Helper>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="mb-4">
							<Label for="emails">My Emails</Label>
							<MultiInput
								bind:array={$form.emails}
								newLine={true}
								name="emails"
								type="email"
								pattern="\+[0-9]+"
							/>
						</div>
						<div class="mb-4">
							<Label for="contact">My Contacts</Label>
							<MultiInput
								bind:array={$form.contacts}
								name="contacts"
								defaultInput="+267"
								placeholder="Start with country code e.g. +267XXXXXXXX"
								pattern="\+[0-9]+"
							/>
						</div>
					</div>

					<div class="mb-4">
						<Label for="physicalAddress" class="mb-2">Physical Address</Label>
						<Input
							type="text"
							id="physicalAddress"
							name="physicalAddress"
							bind:value={$form.physicalAddress}
							Placeholder="E.g Plot 7971, Boseja"
						/>
						<Helper color="red">{$errors.physicalAddress ? $errors.physicalAddress : ''}</Helper>
					</div>

					<div class="mb-4">
						<Label class="flex items-center gap-1"
							>Location<InfoCircleSolid id="locationInfo" /></Label
						>
						<Popover triggeredBy="#locationInfo" placement="right-end" class="w-64"
							>Select a district in order to select one of it's city, town or village</Popover
						>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<Select
									placeholder="Select a District"
									items={districts}
									bind:value={$form.district}
									name="district"
								/>
								<Helper color="red">{$errors.district ? $errors.district : ''}</Helper>
							</div>
							<div>
								<Select
									placeholder="Pick a city,town,village"
									bind:value={$form.location}
									items={district?.settlements ? district?.settlements : []}
									name="location"
								/>
								<Helper color="red">{$errors.location ? $errors.location : ''}</Helper>
							</div>
						</div>
					</div>

					<div class="self-start">
						<div class="flex items-center gap-3 mb-3">
							<h3 class="font-bold text-lg">My Languages</h3>
							<Button size="sm" color="dark" on:click={() => (languageModal = true)}
								>Add a language
								<PlusOutline class="ms-2" />
							</Button>
						</div>
						<Listgroup class="w-auto">
							{#each $form.userLanguages as lang, i}
								<ListgroupItem class="flex items-center justify-between gap-2 ">
									<p>{lang.language}</p>
									{#if lang.proficiency === 'Beginner'}
										<Badge rounded color="dark">{lang.proficiency}</Badge>
									{:else if lang.proficiency === 'Intermediate'}
										<Badge rounded color="blue">{lang.proficiency}</Badge>
									{:else}
										<Badge rounded color="green">{lang.proficiency}</Badge>
									{/if}

									<TrashBinSolid
										class="ms-4"
										on:click={() => {
											$form.userLanguages = $form.userLanguages.filter(
												(x) => x.language !== lang.language
											);
										}}
									/>
								</ListgroupItem>
							{/each}
						</Listgroup>
					</div>
					<Modal title="Add a language" bind:open={languageModal} size="xs" autoclose>
						<div class="mb-4">
							<Label for="language" class="mb-2">Language</Label>
							<datalist id="languageOptions">
								{#each languageOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</datalist>
							<Input
								type="text"
								list="languageOptions"
								id="language"
								name="language"
								bind:value={langObj.language}
								autofocus
								placeholder="Type or select a language"
							/>
							<Helper color="red">{$errors.dob ? $errors.dob : ''}</Helper>
						</div>

						<div class="mb-4">
							<Label for="language" class="mb-2">Proficiency</Label>
							<Select bind:value={langObj.proficiency}>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Fluent">Fluent</option>
								<option value="Native">Native</option>
							</Select>
							<Helper color="red">{$errors.dob ? $errors.dob : ''}</Helper>
						</div>
						<div class="mb-4">
							<Label for="languageExperience" class="mb-2">Years of experience</Label>
							<Input
								type="number"
								id="languageExperience"
								name="languageExperience"
								min="0"
								bind:value={langObj.years}
							/>
							<Helper color="red">{$errors.dob ? $errors.dob : ''}</Helper>
						</div>
						<svelte:fragment slot="footer">
							<Button
								class="w-full"
								on:click={() => {
									$form.userLanguages = [...$form.userLanguages, langObj];
									langObj = {
										language: '',
										proficiency: 'Beginner',
										years: 0
									};
								}}>Add Language</Button
							>
						</svelte:fragment>
					</Modal>
				</Card>

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
												href={new StorageService().getFileView('certificates', ed.certificateSID)
													.url}
												target="_blank"
											>
												<img
													src={new StorageService().getFilePreview(
														'certificates',
														ed.certificateSID
													).url}
													alt="Certificate Link"
													class="w-14 rounded-md"
												/>
											</a>
										{/if}
									</div>
									<Button color="dark" class="px-3">
										<TrashBinSolid />
									</Button>
								</ListgroupItem>
							{/each}
						{/if}
					</Listgroup>
				</Card>
			</div>
		</form>
	{:else}
		<!-- else content here -->
		<Alert color="red" class="shadow-lg">
			<p>An error Occured while trying to get your profile Information</p>
			<p>Please refresh the page or try again later</p>
		</Alert>
	{/if}
{:catch}
	<Alert color="red" class="shadow-lg">
		<p>An error Occured while trying to get your profile Information</p>
		<p>Please refresh the page or try again later</p>
	</Alert>
{/await}

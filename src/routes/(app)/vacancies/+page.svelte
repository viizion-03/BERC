<script>
	import {
		Helper,
		Search,
		Select,
		Button,
		Skeleton,
		Card,
		Alert,
		Spinner,
		Hr,
		Toggle,
		Textarea,
		Listgroup,
		Popover,
		Radio
	} from 'flowbite-svelte';
	import {
		SearchOutline,
		MapPinSolid,
		CalendarMonthSolid,
		AngleRightOutline,
		PlusOutline,
		CloseCircleOutline,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';
	import { Modal, Label, Input, Checkbox } from 'flowbite-svelte';

	let formModal = true;

	export let data;
	const { vacancies, user } = data;
	const dateOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	// Vacancy Form tings
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';
	import { districts } from '$lib/constants.js';
	const { form, errors, enhance, constraints } = superForm(data.newVacancyForm);
	let { organizations } = data;

	$: district = districts.filter((d) => d.value === $form.district)[0];
	let qualification = '';
	let responsibility = '';

	let orgList;
	organizations.then((list) => {
		if (!list) $form.profileType = 'user';
		if (list && list.length > 0) {
			orgList = list.map((o) => {
				return { value: o.$id, name: o.name };
			});
		}
	});
	// userOrgs.then((res) => console.log(res));
</script>

<SuperDebug data={$form} />

<Modal bind:open={formModal} size="xl" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-3" method="post" action="vacancies?/create" use:enhance>
		<h1>Create a job Vacacancy</h1>
		{#if $errors._errors}
			<Alert color="red" class="mb-5">
				{$errors._errors[0]}
			</Alert>
		{/if}

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-4">
				<div>
					<Label for="jobTitle" class="mb-2">Job title</Label>
					<Input type="text" id="jobTitle" name="jobTitle" bind:value={$form.jobTitle} />
					<Helper color="red">{$errors.jobTitle ? $errors.jobTitle : ''}</Helper>
				</div>

				<div>
					<Label for="jobDescription" class="mb-2">Description</Label>
					<Textarea
						type="text"
						id="jobDescription"
						name="jobDescription"
						bind:value={$form.jobDescription}
						class="h-32"
					/>
					<Helper color="red">{$errors.jobDescription ? $errors.jobDescription : ''}</Helper>
				</div>
				<Label class="flex items-center gap-1">Location<InfoCircleSolid id="locationInfo" /></Label>
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
				<div class="grid grid-cols-2 gap-3">
					<div>
						<Label for="yearsOfExperience" class="mb-2">Years of Experience</Label>
						<Input
							type="number"
							id="yearsOfExperience"
							name="yearsOfExperience"
							bind:value={$form.yearsOfExperience}
							{...$constraints.yearsOfExperience}
						/>
						<Helper color="red">{$errors.yearsOfExperience ? $errors.yearsOfExperience : ''}</Helper
						>
					</div>

					<div>
						<Label for="salary" class="mb-2">Salary (BWP)</Label>
						<Input type="number" id="salary" name="salary" bind:value={$form.salary} />
						<Helper color="red">{$errors.salary ? $errors.salary : ''}</Helper>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<Label for="deadline" class="mb-2">Deadline</Label>
						<Input type="date" id="deadline" name="deadline" bind:value={$form.deadline} />
						<Helper color="red">{$errors.deadline ? $errors.deadline : ''}</Helper>
					</div>
					<div>
						<Label for="supportEmail" class="mb-2">Support Email</Label>
						<Input
							type="email"
							id="supportEmail"
							name="supportEmail"
							placeholder="support@example.com"
							bind:value={$form.supportEmail}
						/>
						<Helper color="red">{$errors.supportEmail ? $errors.supportEmail : ''}</Helper>
					</div>
				</div>
				<Toggle bind:checked={$form.isFulltime}
					>{$form.isFulltime ? 'Fulltime' : 'Part-time'}</Toggle
				>
			</div>

			<div class="space-y-4">
				<div>
					<Label for="" class="mb-2">Qualifications</Label>
					<div class="flex items-center">
						<Input
							class="rounded-e-none"
							type="text"
							bind:value={qualification}
							on:keydown={(e) => {
								if (e.key === 'Enter' && qualification) {
									e.preventDefault();
									$form.requirements = [...$form.requirements, qualification];
									qualification = '';
								}
							}}
						/>
						<Button
							class="rounded-s-none"
							on:click={() => {
								if (qualification) {
									$form.requirements = [...$form.requirements, qualification];
									qualification = '';
								}
							}}
						>
							<PlusOutline />
							Add</Button
						>
						<Helper color="red">{$errors.jobDescription ? $errors.jobDescription : ''}</Helper>
					</div>
				</div>

				<div>
					<Label for="" class="mb-2">Responsibilities</Label>
					<div class="flex items-center">
						<Input
							class="rounded-e-none"
							type="text"
							bind:value={responsibility}
							on:keydown={(e) => {
								if (e.key === 'Enter' && responsibility) {
									e.preventDefault();
									$form.responsibilities = [...$form.responsibilities, responsibility];
									responsibility = '';
								}
							}}
						/>
						<Button
							class="rounded-s-none"
							on:click={() => {
								if (responsibility) {
									$form.responsibilities = [...$form.responsibilities, responsibility];
									responsibility = '';
								}
							}}
						>
							<PlusOutline />
							Add</Button
						>
						<Helper color="red">{$errors.jobDescription ? $errors.jobDescription : ''}</Helper>
					</div>
				</div>

				<div class="flex gap-2 max-h-40 overflow-y-hidden">
					<div class=" basis-1/2">
						{#if $form.requirements.length > 0}
							<h3 class="font-semibold">Qualifications</h3>
							<div class="overflow-y-auto max-h-40">
								<Listgroup
									active
									items={$form.requirements}
									let:item
									class="w-full"
									on:click={console.log}
								>
									<span>
										{item}
									</span>
									<CloseCircleOutline
										class="ms-auto"
										on:click={() => {
											$form.requirements = $form.requirements.filter((l) => l !== item);
										}}
									/>
								</Listgroup>
							</div>
						{/if}
					</div>
					<div class="basis-1/2">
						{#if $form.responsibilities.length > 0}
							<h3 class="font-semibold">Responsibilities</h3>
							<div class="max-h-40 overflow-y-auto">
								<Listgroup
									active
									items={$form.responsibilities}
									let:item
									class=""
									on:click={console.log}
								>
									<span>
										{item}
									</span>
									<CloseCircleOutline
										class="ms-auto"
										on:click={() => {
											$form.responsibilities = $form.responsibilities.filter((l) => l !== item);
										}}
									/>
								</Listgroup>
							</div>
						{/if}
					</div>
				</div>
				<div>
					<Label for="otherInfo" class="mb-2">Other Information details</Label>
					<Textarea
						class="h-44"
						type="email"
						id="otherInfo"
						name="otherInfo"
						bind:value={$form.otherInfo}
					/>
					<Helper color="red">{$errors.otherInfo ? $errors.otherInfo : ''}</Helper>
				</div>
			</div>
		</div>

		<Hr></Hr>

		<div>
			<div>
				<Label>Post vacancy as:</Label>
				<Radio name="profileType" bind:group={$form.profileType} required value="user"
					>Individual</Radio
				>

				{#await organizations then orgs}
					{#if orgs}
						<Radio name="profileType" bind:group={$form.profileType} required value="organization"
							>Organization
						</Radio>
						{#if $form.profileType === 'organization'}
							<Select items={orgList} bind:value={$form.organization} name="organization" />
						{:else}
							<input type="hidden" name="userProfile" bind:value={data.user.$id} />
						{/if}
					{/if}
				{/await}
			</div>

			<!--HIDDEN FIELDS  -->
			{#each $form.requirements as req}
				<input type="hidden" name="requirements" value={req} />
			{/each}

			{#each $form.responsibilities as res}
				<input type="hidden" name="responsibilities" value={res} />
			{/each}

			<Button type="submit" class="max-w-72 mx-auto">Post vacancy</Button>
		</div>
	</form>
</Modal>

<div class="px-44">
	<h1 class="text-4xl font-bold mb-5 text-center">Open Job Vacancies</h1>
	<div class="flex w-1/2 mx-auto mb-2">
		<Search size="md" class="rounded-none rounded-s-md" />
		<Button class="rounded-none rounded-e-md">
			<SearchOutline class="size-5" />
		</Button>
	</div>

	{#if user}
		<Hr hrClass="w-64">or</Hr>
		<div class="flex mb-3 mt-4 justify-center items-center">
			<Button color="alternative" on:click={() => (formModal = true)}>Create a Job Vacancy</Button>
		</div>
	{/if}

	{#await vacancies}
		<div class="flex justify-center">
			<code class="mx-auto mb-3">
				Loading Vacancies
				<Spinner size={6} />
			</code>
		</div>
		<div class="grid grid-cols-3 gap-5">
			<Card>
				<Skeleton size="sm" />
			</Card>
			<Card>
				<Skeleton size="sm" />
			</Card>
			<Card>
				<Skeleton size="sm" />
			</Card>
			<Card>
				<Skeleton size="sm" />
			</Card>
			<Card>
				<Skeleton size="sm" />
			</Card>
			<Card>
				<Skeleton size="sm" />
			</Card>
		</div>
	{:then res}
		{#if 'docs' in res}
			<div class=" grid grid-cols-3 gap-5">
				{#each res.docs.documents as v}
					<Card horizontal href="/vacancies/{v.$id}">
						<img src="" alt="" />
						<div class="flex w-full flex-col h-full">
							<p class="text-xl font-bold">{v.jobTitle}</p>
							<p class=" ">P {v.salary}, {v.isFulltime ? 'Fulltime' : 'Part-time'}</p>
							<p class="flex items-center gap-1 mb-4">
								{v.location}, {v.district}
								<!-- <MapPinSolid /> -->
							</p>

							<p class="flex items-center gap-1 text-red-500 mt-auto">
								<CalendarMonthSolid />
								<span>
									{new Date(v.deadline).toLocaleDateString('en-us', {
										day: 'numeric',
										month: 'long',
										weekday: 'short',
										year: 'numeric'
									})}
								</span>
							</p>
						</div>
						<AngleRightOutline />
					</Card>
				{/each}
			</div>
		{:else}
			<Alert
				>An Error occured when retrieving job vacancies, Kindly Refresh the page or try again later.</Alert
			>
		{/if}
	{/await}
</div>

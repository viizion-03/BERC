<script>
	import Hero from '$lib/assets/hero.png';
	import {
		Search,
		Button,
		Dropdown,
		DropdownItem,
		Card,
		Toggle,
		VideoPlaceholder
	} from 'flowbite-svelte';
	import {
		SearchOutline,
		ChevronDownOutline,
		ArrowRightOutline,
		ArrowUpRightFromSquareOutline
	} from 'flowbite-svelte-icons';
	import { StorageService } from '$lib/services/appwrite';
	import VacanyImg from '$lib/assets/defaults/vacancy.jpg';

	export let data;
	const { vacancies } = data;
	const storageService = new StorageService();
	const items = [
		{
			label: 'Job Vacancies'
		},
		{
			label: 'Collaboration'
		},
		{
			label: 'Company Profiles'
		},
		{
			label: 'User Profiles'
		},
		{
			label: 'Forums'
		}
	];

	let selectCategory = 'Job Vacancies';

	const vacancyClasses = 'shrink-0 ';
</script>

<div class="bg-slate-500">
	<div class="flex justify-center h-[460px]">
		<div class="w-2/5 flex justify-center">
			<img class="h-full object-contain rounded-lg" src={Hero} alt="Man in suit" />
		</div>
		<div class="p-20 text-center">
			<h1 class="mt-6 text-4xl font-bold text-white">Botswana E-recruitment Centre</h1>
			<p class="mt-2 mb-10 text-yellow-300">Home to Botswana's future work economy</p>

			<p class="w-3/4 m-auto font-semibold italic text-gray-200">
				Find work, employees, or collaborators, explore topic discussions regarding your field of
				interest, & Manage your onboarding selection on BERC.
			</p>
		</div>
	</div>
</div>
<form class="flex w-3/5 m-auto -translate-y-5">
	<div class="relative">
		<Button
			size="md"
			color="light"
			class="rounded-e-none whitespace-nowrap border border-e-0 focus-within:ring-0 focus-within:border-red-600"
		>
			{selectCategory}
			<ChevronDownOutline class="size-5 ms-2.5" />
		</Button>
		<Dropdown classContainer="w-40">
			{#each items as { label }}
				<DropdownItem
					on:click={() => {
						selectCategory = label;
					}}
					class={selectCategory === label ? 'underline' : ''}
				>
					{label}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
	<Search
		size="md"
		class="rounded-none py-2.5 focus:outline-0"
		placeholder="Search for Jobs, Companies, People, Forums..."
	/>
	<Button size="md" class="!p-2.5 rounded-s-none" type="submit">
		<SearchOutline class="w-6 h-4" />
	</Button>
</form>

<!-- Quick Overview Section -->
<div class="px-44">
	<h2 class="font-bold text-3xl mb-1">Quick Overview</h2>
	<h3 class="font-semibold text-xl mb-3">Job Opportunities</h3>

	<div class="flex justify-between items-center mb-2">
		<div class="gap-1 flex">
			<Button size="xs" color="dark" class="py-1" pill>Latest</Button>
			<Button size="xs" color="alternative" class="py-1" pill>Near Me</Button><Button
				size="xs"
				color="alternative"
				class="py-1"
				pill>Top paying</Button
			>
		</div>
		<Button href="#" size="sm">See More</Button>
	</div>

	<div>
		<div class="flex overflow-x-auto gap-4">
			{#await vacancies}
				<!-- promise is pending -->
				...GETTING VACANCIES
			{:then res}
				{#if res.success && 'docs' in res}
					{#each res.docs.documents as v}
						<!-- content here -->

						{#if v.userProfile}
							<Card
								horizontal
								size="md"
								img={v.userProfile.avatarSID
									? storageService.getFilePreview('avatars', v.userProfile.avatarSID)?.url
									: VacanyImg}
								class={vacancyClasses}
							>
								<div class="flex flex-col h-full">
									<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
										{v.jobTitle}
									</h5>
									<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
										{v.jobDescription}
									</p>
									<p>{v.location}</p>
									<p>P {v.salary}</p>
									<div class="mt-auto">
										<Button>
											Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
										</Button>

										<Button>
											Apply<ArrowUpRightFromSquareOutline class="w-3.5 h-3.5 ms-2 text-white" />
										</Button>
									</div>
								</div>
							</Card>
						{:else}
							<!-- else content here -->
							<Card
								horizontal
								size="md"
								img={v.organization.logoSID
									? storageService.getFilePreview('logos', v.organization.logoSID)?.url
									: VacanyImg}
								class={vacancyClasses}
							>
								<div class="flex flex-col h-full">
									<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
										{v.jobTitle}
									</h5>
									<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
										{v.jobDescription}
									</p>
									<p>{v.location}</p>
									<p>P {v.salary}</p>
									<div class="mt-auto">
										<Button>
											Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
										</Button>

										<Button>
											Apply<ArrowUpRightFromSquareOutline class="w-3.5 h-3.5 ms-2 text-white" />
										</Button>
									</div>
								</div>
							</Card>
						{/if}
					{/each}
				{/if}
			{/await}

			
		</div>
	</div>
</div>

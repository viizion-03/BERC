<script>
	// @ts-nocheck

	import {
		Avatar,
		Search,
		Skeleton,
		Button,
		Spinner,
		Alert,
		Heading,
		P,
		Toast
	} from 'flowbite-svelte';
	import {
		SearchOutline,
		MapPinSolid,
		MapPinAltSolid,
		CalendarMonthSolid
	} from 'flowbite-svelte-icons';
	import { StorageService } from '$lib/services/appwrite.js';
	import { page } from '$app/stores';
	import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
	import { districts } from '$lib/constants.js';
	import MyToast from '$lib/components/MyToast.svelte';
	export let data;
	const { vacancies } = data;

	$: selected = $page.params.id;

	let Loading = false;
	$: vacancy = vacancies.then((res) => {
		if ('docs' in res) {
			return res.docs.documents.filter((v) => v.$id === selected)[0];
		}
	});

	// @ts-ignore
	function getDaysSince(dateString) {
		const today = new Date();
		const otherDate = new Date(dateString);
		// @ts-ignore
		const differenceInMilliseconds = today - otherDate;
		const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

		return differenceInDays;
	}

	console.log(vacancy);
</script>

<MyToast />

<div class="flex h-full overflow-y-hidden ">
	<!-- Other Vacancies -->
	<div class="min-w-52 w-1/6 flex flex-col h-full bg-white flex-shrink-0">
		<div class="flex">
			<Search size="sm" class="rounded-none h-full outline-none" />
			<Button size="sm" class="rounded-none">
				<SearchOutline class="size-5" />
			</Button>
		</div>

		<div class="flex min-h-96 flex-col flex-grow overflow-y-auto">
			{#await vacancies}
				<div class="flex justify-center h-fullitems-center">
					<Spinner />
				</div>
			{:then res}
				<nav>
					{#if 'docs' in res}
						{#each res.docs.documents as v}
							<a href="/vacancies/{v.$id}">
								<div
									class="border p-3 px-6 border-l-4 border-l-orange-500 hover:shadow-lg hover:bg-slate-50"
								>
									<p class="text-lg font-semibold">{v.jobTitle}</p>
									<p class="">P {v.salary}</p>
									<p class="">
										{v.location}, {districts.filter((d) => d.value === v.district)[0].name}
									</p>
								</div>
							</a>
						{/each}
					{:else}
						<Alert
							>An Error occured when retrieving job vacancies, Kindly Refresh the page or try again
							later.</Alert
						>
					{/if}
				</nav>
			{/await}
		</div>
	</div>

	<!-- Main Vacancy to be viewed -->

	<div class="flex-grow py-8 px-12 overflow-y-auto">
		{#await vacancy}
			<Skeleton></Skeleton>
			<Skeleton></Skeleton>
		{:then v}
			{#if v}
				<h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">{v.jobTitle}</h1>
				{#if v.organization}
					<div class="flex gap-1 items-center mt-3 mb-3">
						<p class="text-gray-500 dark:text-gray-400">at</p>
						<h2 class="text-2xl font-semibold tracking-tighter sm:text-3xl">
							{v.organization.name}
						</h2>
					</div>
				{:else}
					<div class="flex gap-1 items-center mt-3 mb-3">
						<span class="text-gray-500 dark:text-gray-400">with</span>
						<h2 class="text-lg font-semibold tracking-tighter sm:text-3xl">
							{v.userProfile.firstname}
							{v.userProfile.surname}
						</h2>
					</div>
				{/if}
				<div class="grid grid-cols-3 items-center gap-4 mb-8">
					<div class="flex items-center gap-2">
						<MapPinAltSolid />
						<span class="text-sm text-gray-500 dark:text-gray-400"
							>{v.location}, {districts.filter((d) => d.value === v.district)[0].name}</span
						>
					</div>
					<div class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="w-5 h-5 mr-2.5 flex-shrink-0"
						>
							<rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
							<line x1="16" x2="16" y1="2" y2="6"></line>
							<line x1="8" x2="8" y1="2" y2="6"></line>
							<line x1="3" x2="21" y1="10" y2="10"></line>
						</svg>
						<span class="text-sm text-gray-500 dark:text-gray-400">
							{#if getDaysSince(v.$createdAt) === 0}
								Posted today
							{:else}
								Posted {getDaysSince(v.$createdAt)} days ago
							{/if}
						</span>
					</div>
					<div>
						<p class="flex items-center gap-1">
							<CalendarMonthSolid />
							Deadline:
							<span class="text-primary-800">
								{new Date(v.deadline).toLocaleDateString('en-us', {
									day: 'numeric',
									month: 'long',
									weekday: 'short',
									year: 'numeric'
								})}
							</span>
						</p>
					</div>
				</div>

				<div class="flex flex-col gap-6">
					<div class="grid gap-2">
						<h3 class="text-xl font-bold">Description</h3>
						<p class="text-gray-500 text-justify dark:text-gray-400">
							{v.jobDescription}
						</p>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div class="grid gap-2">
							<h3 class="text-xl font-bold">Qualifications</h3>
							<ul class="list-disc list-inside grid gap-2">
								{#each v.requirements as req}
									<li>{req}</li>
								{/each}
							</ul>
						</div>
						{#if v.responsibilities}
							<div class="grid gap-2">
								<h3 class="text-xl font-bold">Responsibilities</h3>
								<ul class="list-disc list-inside grid gap-2">
									{#each v.requirements as req}
										<li>{req}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					{#if v.otherInfo}
						<div class="grid gap-2">
							<h3 class="text-xl font-bold">More Info</h3>
							<p class='text-justify'>{v.otherInfo}</p>
						</div>
					{/if}

					{#if v.supportEmail}
						<div class="grid gap-2">
							<h3 class="text-xl font-bold">Application Queries</h3>
							<p class="text-gray-500 dark:text-gray-400">
								If you have any other questions or queries please contact the following email
								address {' '}
								<a
									class="underline underline-offset-2 underline-dotted text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
									href="mailto:{v.supportEmail}?subject={v.jobTitle} Query"
								>
									{v.supportEmail}
								</a>
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<Alert>An Error occured when retrieving your job Vacancy. Please try again Later</Alert>
			{/if}
		{/await}
	</div>

	{#await vacancy}
		<Skeleton />
	{:then v}
		{#if v}
			<div class="flex flex-col gap-4 min-w-52 w-1/6 flex-shrink-0 bg-white px-1 bg-opacity-70">
				<div
					class="border border-gray-200 border-dashed rounded-lg grid place-items-center w-full aspect-youtube overflow-hidden dark:border-gray-800"
				>
					{#if v.userProfile}
						{#if v.userProfile.coverPhotoSID}
							<!-- svelte-ignore a11y-img-redundant-alt -->
							<a href="/users/{v.userProfile.$id}">
								<img
									src={new StorageService().getFilePreview(
										'coverPhotos',
										v.userProfile.coverPhotoSID
									).url}
									alt="Cover Photo"
									width="360"
									height="315"
									class="object-cover object-center"
									style="aspect-ratio: 560 / 315; object-fit: cover;"
								/>
							</a>
						{:else}
							<!-- svelte-ignore a11y-missing-content -->
							<a href="/users/{v.userProfile.$id}" class="h-28 bg-slate-500 w-full"></a>
							<!-- <div class="h-28 bg-slate-500 w-full"></div> -->
						{/if}
						<Avatar
							class="-translate-y-10 border border-slate-400"
							size="lg"
							src={new StorageService().getFilePreview('avatars', v.userProfile.avatarSID).url}
						/>
						<a class="-translate-y-7 font-bold text-lg" href="/users/{v.userProfile.$id}"
							>{v.userProfile.firstname} {v.userProfile.surname}</a
						>
					{:else}
						<!-- svelte-ignore a11y-img-redundant-alt -->
						{#if v.organization.coverImageSID}
							<a href="/organizations/{v.organization.$id}">
								<img
									src={new StorageService().getFilePreview(
										'coverPhotos',
										v.organization.coverImageSID
									).url}
									alt="Cover Photo"
									width="360"
									height="315"
									class="object-cover object-center"
									style="aspect-ratio: 560 / 315; object-fit: cover;"
								/>
							</a>
						{:else}
							<!-- svelte-ignore a11y-missing-content -->
							<a href="/organizations/{v.organization.$id}" class="h-28 bg-slate-500 w-full"></a>
						{/if}
						<Avatar
							class="-translate-y-10 border border-slate-400"
							size="lg"
							src={new StorageService().getFilePreview('logos', v.organization.logoSID).url}
						/>
						<a class="-translate-y-7 font-bold text-lg" href="/organizations/{v.organization.$id}"
							>{v.organization.name}</a
						>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<button
						class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full max-w-[300px] justify-start"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-4 w-4"
						>
							<path d="M5 12h14"></path>
							<path d="m12 5 7 7-7 7"></path>
						</svg>
						Apply Now
					</button>
					<button
						class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full max-w-[300px] justify-start"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-4 w-4"
						>
							<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
						</svg>
						Save Job
					</button>
				</div>
			</div>
		{/if}
	{/await}
</div>

<style lang="postcss">
	p,
	h1,
	h2,
	h3,
	h4,
	h5 {
		color: theme(colors.gray.700) !important;
	}
</style>

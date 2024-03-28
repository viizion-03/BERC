<script>
	import { Search, Button, Skeleton, Card, Alert, Spinner } from 'flowbite-svelte';
	import { SearchOutline, MapPinSolid, CalendarMonthSolid,AngleRightOutline } from 'flowbite-svelte-icons';

	export let data;
	const { vacancies } = data;
	const dateOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	vacancies.then((res) => console.log(res));
</script>

<div class="px-44">
	<h1 class="text-4xl font-bold mb-5 text-center">Open Job Vacancies</h1>
	<div class="flex w-1/2 mx-auto mb-8">
		<Search size="md" />
		<Button>
			<SearchOutline class="size-5" />
		</Button>
	</div>

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
					<Card horizontal href='/vacancies/{v.$id}'>
						<img src="" alt="" />
						<div class='flex w-full flex-col h-full'>
							<p class="text-xl font-bold">{v.jobTitle}</p>
                            <p class=' '>P {v.salary}, {v.isFulltime ? 'Fulltime' : 'Part-time'}</p>
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

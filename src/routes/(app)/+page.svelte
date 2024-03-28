<script>
	import Hero from '$lib/assets/hero.png';
	import {
		Search,
		Button,
		Dropdown,
		DropdownItem,
		Card,
		AccordionItem,
		Accordion,
		Heading,
		P,
		Indicator,
		Avatar
	} from 'flowbite-svelte';
	import {
		SearchOutline,
		ChevronDownOutline,
		ArrowRightOutline,
		ArrowUpRightFromSquareOutline,
		QuestionCircleOutline,
		QuoteOutline
	} from 'flowbite-svelte-icons';
	import { StorageService } from '$lib/services/appwrite';
	import VacanyImg from '$lib/assets/defaults/vacancy.jpg';
	import ChatImg from '$lib/assets/chat.jpg';
	import ChatImg2 from '$lib/assets/chat2.jpg';
	import Logo from '$lib/assets/logo_light.png';

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

	const vacancyClasses = 'shrink-0 shadow-lg';
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
				Find work, employees, or collaborators. Explore topic discussions regarding your field of
				interest, & Manage your onboarding selections on BERC.
			</p>
		</div>
	</div>
</div>
<form class="flex w-3/5 m-auto -translate-y-5 shadow-xl mb-8">
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
	<h2 class="font-bold text-3xl mb-3">Quick Overview</h2>
	<h3 class="font-semibold text-xl mb-3">Job Opportunities</h3>

	<div class="flex justify-between items-center mb-5">
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

	<div class="mb-16 py-3">
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

	<div class="flex justify-between mb-4">
		<h3 class="font-semibold text-xl mb-3">Collaboaration Opportunities</h3>
		<Button>See More</Button>
	</div>

	<div class="grid gap-3 gap-y-5 items-center grid-cols-3 mb-16 bg-slate-500 p-5 rounded-md">
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Music Artist Wanted
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
				chronological order.
			</p>
			<p>3 spots available</p>
			<Button class="w-fit">
				Read more <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
			</Button>
		</Card>
	</div>

	<!-- BERC DESCRIPTION SECTION -->
</div>
<section class="mb-10">
	<div class="bg-network h-[35rem] text-white p-10 text-center xl:px-72 flex flex-col items-center">
		<!-- <h2 class="text-3xl font-bold text-center mb-3 shadow-lg">What is BERC</h2> -->
		<Heading
			tag="h1"
			class="mb-12"
			color="white"
			customSize="text-4xl font-extrabold md:text-5xl lg:text-6xl">What is BERC</Heading
		>
		<div class="bg-black bg-opacity-65 rounded-lg">
			<P
				color="alternative"
				class="py-3 bg-opacity-65 rounded-md mb-6 text-lg lg:text-xl sm:px-16  dark:text-gray-400"
				>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
				long-term value and drive economic growth.</P
			>
			<P
				color="alternative"
				class="py-3 bg-opacity-65 rounded-md mb-6 text-lg lg:text-xl sm:px-16  dark:text-gray-400"
				>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
				long-term value and drive economic growth.</P
			>
		</div>
		<Button href="/" class="mt-auto self-end">
			Learn more
			<ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
		</Button>
	</div>
</section>

<section class="px-44 mb-12">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-semibold">Today's Hot Topics</h2>
		<Button>See more</Button>
	</div>
	<div class="grid grid-cols-2 items-center">
		<!-- Forum Topic Wedges -->
		<div class="flex flex-col items-center bg-blue-200 p-3 rounded-lg">
			<Button class="self-end" color="dark">More Forums</Button>
			<div class="flex flex-col items-start w-80 max-w-96 min-w-64 p-3 gap-4 rounded-md">
				<!-- Item -->
				<div class="shadow-xl bg-white flex items-center border px-2 rounded-2xl">
					<img
						src="https://api.dicebear.com/8.x/adventurer/svg?seed=Charlie"
						class="size-16"
						alt=""
					/>
					<p>Random topic here</p>
					<Indicator color="green" border size="xl" placement="" class="text-xs font-bold"
						>20</Indicator
					>
				</div>
				<!-- Item -->
				<div class="shadow-xl bg-white flex items-center border px-2 rounded-2xl self-end">
					<Indicator color="green" border size="xl" placement="" class="text-xs font-bold"
						>113</Indicator
					>
					<p>Random topic here</p>
					<img
						src="https://api.dicebear.com/8.x/adventurer/svg?seed=Charlie"
						class="size-16"
						alt=""
					/>
				</div>
				<!-- Item -->
				<div class="shadow-xl bg-white flex items-center border px-2 rounded-2xl">
					<img
						src="https://api.dicebear.com/8.x/adventurer/svg?seed=Charlie"
						class="size-16"
						alt=""
					/>
					<p>Random topic here</p>
					<Indicator color="green" border size="xl" placement="" class="text-xs font-bold"
						>31</Indicator
					>
				</div>
				<div class="shadow-xl bg-white flex items-center border px-2 rounded-2xl self-end">
					<Indicator color="green" border size="xl" class="text-xs font-bold">57</Indicator>
					<p>Random topic here</p>
					<img
						src="https://api.dicebear.com/8.x/adventurer/svg?seed=Charlie"
						class="size-16"
						alt=""
					/>
				</div>
				<!-- Item -->
			</div>
		</div>
		<img src={ChatImg} alt="" class="size-[26rem] m-auto" />
	</div>
</section>

<section class="px-44 mb-12">
	<h2 class="text-3xl font-bold text-center">BERC Unique Features</h2>
	<div class="grid grid-cols-3 gap-3">
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
		<Card class="flex flex-col items-center">
			<img src={ChatImg2} alt="" class="" />
			<p>Secure Message, Voice & Video chat</p>
		</Card>
	</div>
</section>

<div class='flex justify-center mb-12'>

	<div class="bg-blue-400 p-6 max-w-80 rounded-md flex flex-col gap-4 text-center">
		<p class='text-lg font-semibold'>Join the Berc Community & Boost your career</p>
		<Button>Create Your Account</Button>
	</div>
</div>

<section class='grid grid-cols-2 px-44'>
	<div>
		<img src={Logo} alt="" size=''>
		<h3>Contact Us</h3>
		<p>Email: info@berc.cloud</p>
		<p>tel: 367 9891/ 71769269</p>
	</div>

	<div>
		<!-- FAQS -->
		<Accordion>
			<AccordionItem>
				<span slot="header" class="text-base flex gap-2">
					<QuestionCircleOutline class="mt-0.5" />
					<span>My Header 1</span>
				</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint
					explicabo...
				</p>
				<p class="text-gray-500 dark:text-gray-400">
					Check out this guide to learn how to <a
						href="/"
						target="_blank"
						rel="noreferrer"
						class="text-blue-600 dark:text-blue-500 hover:underline"
					>
						get started
					</a>
					and start websites even faster with components on top of Tailwind CSS.
				</p>
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-base flex gap-2">
					<QuestionCircleOutline class="mt-0.5" />
					<span>My Header 2</span>
				</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus
					sintexplicabo...
				</p>
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-base flex gap-2">
					<QuestionCircleOutline class="mt-0.5" />
					<span>My Header 1</span>
				</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint
					explicabo...
				</p>
				<p class="text-gray-500 dark:text-gray-400">
					Check out this guide to learn how to <a
						href="/"
						target="_blank"
						rel="noreferrer"
						class="text-blue-600 dark:text-blue-500 hover:underline"
					>
						get started
					</a>
					and start websites even faster with components on top of Tailwind CSS.
				</p>
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-base flex gap-2">
					<QuestionCircleOutline class="mt-0.5" />
					<span>My Header 2</span>
				</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus
					sintexplicabo...
				</p>
			</AccordionItem>
		</Accordion>
	</div>
</section>

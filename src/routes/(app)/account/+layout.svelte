<script>
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownItem,
		SidebarDropdownWrapper
	} from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		ShoppingBagSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		NewspaperSolid,
		FolderDuplicateSolid,
		MessagesSolid,
		BuildingSolid,
		UserSettingsSolid,
		FileChartBarSolid
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	import {page} from '$app/stores'

	$: activeUrl = $page.url.pathname;
	let activeClass =
		'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
	let nonActiveClass =
		'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-green-700';
</script>

<div class="flex h-full">
	<Sidebar class="h-full" {activeUrl} {activeClass} {nonActiveClass}>
		<SidebarWrapper>
			<SidebarGroup>
				<SidebarItem label="Dashboard" href="/account">
					<svelte:fragment slot="icon">
						<ChartPieSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="My Profile & CV" href="/account/profile">
					<svelte:fragment slot="icon">
						<FileChartBarSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarDropdownWrapper label="Vacancies">
					<svelte:fragment slot="icon">
						<FolderDuplicateSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<SidebarDropdownItem label="Applied For" href="/account/applications" />
					<SidebarDropdownItem label="Posted" href="/account/vacancies" />
				</SidebarDropdownWrapper>
				<SidebarItem label="Forums" href="/account/forums">
					<svelte:fragment slot="icon">
						<NewspaperSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Organizations" href="/account/organizations">
					<svelte:fragment slot="icon">
						<BuildingSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Projects" href="/account/projects/" {spanClass}>
					<svelte:fragment slot="icon">
						<GridSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"
						>
							Pro
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Inbox" href="/account/inbox" {spanClass}>
					<svelte:fragment slot="icon">
						<MessagesSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"
						>
							3
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Account Settings">
					<svelte:fragment slot="icon">
						<UserSettingsSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<div class="flex-grow">
		<slot />
	</div>
</div>

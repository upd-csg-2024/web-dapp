<script lang="ts">
	import '../../app.postcss';
	import { page } from '$app/stores';
	import { username } from '$lib/gun-setup';
	import { fly } from 'svelte/transition';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import {
		autoModeWatcher,
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		getDrawerStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';

	import Navigation from '$lib/components/Navigation.svelte';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		bgDrawer: 'bg-primary-900 text-white',
		width: 'w-[280px] md:w-[480px]',
		padding: 'p-4',
		rounded: 'rounded-xl'
	};
	function drawerOpen(): void {
		drawerStore.open(drawerSettings);
	}

	// $: displayPic = $userData?.photoURL;
	$: initials = $username
		?.split(' ')
		.filter((_, i, arr) => i === 0 || i === arr.length - 1)
		.map((n) => n[0])
		.join('');
	const appName = 'SecuriMed';
	let title = appName;
	$: {
		if ($page.url.pathname.startsWith('/')) {
			let pathParts = $page.url.pathname.split('/');
			title = pathParts[2]
				? pathParts[2].charAt(0).toUpperCase() + pathParts[2].slice(1)
				: 'Dashboard';
		} else {
			title = 'SecuriMed';
		}
		console.log(title);
	}
</script>

<svelte:head>
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
	<title>{title}</title>
</svelte:head>

<Drawer>
	<Navigation />
</Drawer>

<AppShell
	class="h-screen"
	slotSidebarLeft="w-0 lg:w-60 bg-surface-50-900-token border-r border-surface-500/30"
>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-xl">
			<svelte:fragment slot="lead">
				<button class="btn-icon btn-icon-sm mr-4 lg:!hidden" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="30" width="100" height="20" />
							<rect y="60" width="100" height="20" />
						</svg>
					</span>
				</button>
				<h3 class="h3">SecuriMed</h3>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<a href="/{$username}/settings">
					<Avatar
						{initials}
						width="w-12"
						background="bg-primary-500"
						border="border-4 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer"
					/>
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<div class="container p-10 mx-auto">
		<slot />
	</div>
</AppShell>

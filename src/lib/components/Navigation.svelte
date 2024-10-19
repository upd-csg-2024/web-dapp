<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { username, usersea, user } from '$lib/gun-setup';

	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}

	let firstname: string;
	let lastname: string;

	user.get( 'securimed' ).get('profile').on( ( data: any, key: string ) => {
		firstname = data.firstname || '';
		lastname = data.lastname || '';
	})

	const signOut = () => {
		user.leave();
		username.set('');
		usersea.set({});
	}
</script>

{#if $username}
	<div class="p-4 flex flex-col justify-between h-full">
		
		<h4 class="h4 align-bottom">Good morning,<br /> 
			{#if firstname || lastname}
				{[firstname, lastname].join(' ')}
			{:else}
			{$username}
			{/if}
		</h4>
		<nav class="list-nav">
				<ul>
					<li><a class="my-4" href={`/${$username}`} on:click={drawerClose}>Dashboard</a></li>
					<li>
						<a class="my-4" href={`/${$username}/trustors`} on:click={drawerClose}>Trustors</a>
					</li>
					<li>
						<a class="my-4" href={`/${$username}/settings`} on:click={drawerClose}>Settings</a>
					</li>
				</ul>
		</nav>
		<a
			href="/"
			class="btn variant-filled-primary mt-auto"
			data-sveltekit-preload-data="hover"
			on:click={ signOut }
		>
			Sign Out
		</a>
	</div>
{/if}

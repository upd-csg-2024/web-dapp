<script lang="ts">
	import { username, user } from '$lib/gun-setup';

	// const signOut = () => {
	// 	user.leave();
	// 	username.set('');
	// }
	console.log( )
</script>

<svelte:head>
	<title>SecuriMed</title>
</svelte:head>

<main>
	<div class="flex flex-col justify-start items-center mx-auto h-screen pt-20">
		<h3 class="h3 mx-auto">Welcome to</h3>
		<h1 class="h1 text-8xl mb-4">
			<span
				class="bg-gradient-to-br from-primary-500 to-tertiary-700 bg-clip-text text-transparent box-decoration-clone"
				>SecuriMed</span
			>
		</h1>
		{#if $username}
			<a href="/{$username}" class="btn variant-ghost-primary hover:variant-filled-primary">Go to Dashboard</a>
		{:else}
			<a href="/login" class="btn variant-ghost-primary hover:variant-filled-primary">Get Started</a>
		{/if}
	</div>
</main>

<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { Trash2 } from 'lucide-svelte';
	import { user, db, getUserEPub } from '$lib/gun-setup';
	import SEA from 'gun/sea';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let trustees: { [key: string]: { alias: string; firstname: string; lastname: string } } = {};
	const trusteeStore : Writable<{ [key: string]: { [key: string] : any } }> = writable({});

	user.get('securimed').get('scmtrste').map().on(async (data: string, key: string) => {
		if ( data ) {
			const trusteeEPub = getUserEPub(key);
			const secret = (await SEA.secret(trusteeEPub, user._.sea)) || '';
			if (!secret) {
				console.log('cannot get trustee', key);
				return;
			}

			const dec = await SEA.decrypt(data, secret);
			let alias = '';
			let firstname = '';
			let lastname = '';
			db.user(key).get('alias').once((t_alias: string) => {
				console.log('alias', t_alias);
				alias = t_alias;
			});
			db.user(key).get('securimed').get('profile').on( ( data: any ) => {
				if ( data.firstname ) {
					firstname = data.firstname;
				}
				if ( data.lastname ) {
					lastname = data.lastname;
				}
			})
			trustees[key] = { alias, firstname, lastname };
			trusteeStore.set(trustees);
			console.log('trustees', key, alias, dec);
		}
	});

	// let tableArr = [
	// 	{ firstName: 'Mikhaela', lastName: 'Tapia', alias: 'Kae' },
	// 	{ firstName: 'Alquen', lastName: 'Sarmiento', alias: 'Alquen' },
	// 	{ firstName: 'Angelo', lastName: 'Convento', alias: 'Gelo' }
	// ];

	// removeRow function not persistent
	// function removeRow(index: number) {
	// 	tableArr = tableArr.filter((_, i) => i !== index);
	// }
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->

		<!-- Responsive Container (recommended) -->
		<div class="table-container">
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Alias</th>
						<th>First Name</th>
						<th>Last Name</th>
						<!-- <th>Action</th> -->
					</tr>
				</thead>
				<tbody>
					{#each Object.values($trusteeStore) as trustee }
						<tr>
							<td>{trustee.alias}</td>
							<td>{trustee.firstname}</td>
							<td>{trustee.lastname}</td>
							<!-- <td><button on:click={() => removeRow(i)}><Trash2 /></button></td> -->
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}

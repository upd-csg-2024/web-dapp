<script lang="ts">
	import {
		initializeStores,
		Toast,
		getToastStore,
		Modal,
		getModalStore,
		type ToastSettings,
		type ModalSettings,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import { user, db, getSCMRooms, getUserEPub, usersea } from '$lib/gun-setup';
	import ModalTable from '$lib/components/ModalTable.svelte';
	import SEA from 'gun/sea';
	import { fly } from 'svelte/transition';
	initializeStores();

	const modalStore = getModalStore();
	function viewTrustees(): void {
		const c: ModalComponent = { ref: ModalTable };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Trustees',
			body: 'This contains the list of all your currently added trustees.',
			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}

	const toastStore = getToastStore();
	let toastId = '';

	const toastCreate = (message: string) => {
		const t: ToastSettings = {
			message: message,
			background: 'variant-filled-success',
			hideDismiss: true,
			timeout: 3000
		};
		toastId = toastStore.trigger(t);
	};

	const closeToast = () => {
		toastStore.close(toastId);
	};
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	let store: { [key: number]: string } = {};
	let hr: number;
	let firstname: string;
	let lastname: string;
	let saving: boolean = false;
	let adding: boolean = false;
	let trustees: { [key: string]: {} } = {};
	let trusteeToAdd: string;

	user
		.get('securimed')
		.get('profile')
		.on((data: any, key: string) => {
			firstname = data.firstname || '';
			lastname = data.lastname || '';

			// console.log( 'securimed', data, key );
		});
	user
		.get('securimed')
		.get('rex')
		.get('hr')
		.map()
		.on(async (data: string, key: number) => {
			const roompair = getSCMRooms();
			const val = await SEA.decrypt(data, roompair);
			store[key] = val;
			console.log( 'data', key, val );
		});

	// const add = async () => {
	// 	const datetime = new Date().valueOf();
	// 	const data : {[key: number]: string}= {};
	// 	const roompair = getSCMRooms();
	// 	const enc = await SEA.encrypt( hr, roompair );
	// 	data[datetime] = enc;
	// 	user.get('securimed').get('recs').get('hr').put(data);
	// }

	const updateFirstName = () => {
		saving = true;
		user
			.get('securimed')
			.get('profile')
			.get('firstname')
			.put(firstname)
			.then(() => {
				toastCreate('First name updated!');
				saving = false;
			});
	};

	const updateLastName = () => {
		saving = true;
		user
			.get('securimed')
			.get('profile')
			.get('lastname')
			.put(lastname)
			.then(() => {
				toastCreate('Last name updated!');
				saving = false;
			});
	};

	const addTrustee = async () => {
		adding = true;
		const data: { [key: string]: string } = {};
		const roompair = getSCMRooms();
		console.log('roompair', roompair);
		const trusteeEPub = getUserEPub(trusteeToAdd);
		console.log('trusteeEPub', trusteeEPub);
		const secret: string = (await SEA.secret(trusteeEPub, user._.sea)) || '';
		if (!secret) {
			toastCreate('Trustee not found!');
			trusteeToAdd = '';
			adding = false;
			return;
		}
		const enc = await SEA.encrypt(roompair, secret);
		data[trusteeToAdd] = enc;

		user
			.get('securimed')
			.get('scmtrste')
			.put(data)
			.then(() => {
				toastCreate('Trustee granted access!');
				trusteeToAdd = '';
				adding = false;
			});
	};

	const copyPubKey = () => {
		navigator.clipboard.writeText(user._.sea.pub);
		toastCreate('Public key copied!');
	};

	$: heartrates = Object.entries(store).sort((a: any, b: any) => a[0] - b[0]);
	// $: _trustees = Object.entries(trustees).sort(( a: any, b: any ) => a[0] - b[0] );
</script>

<Toast />
<Modal />
<div
	class="container h-full mx-auto flex justify-start items-start"
	in:fly={{ x: -20, duration: 300 }}
>
	<div class="space-y-5">
		<h2 class="h2">Settings</h2>
		<div>
			<h3 class="h3">Profile</h3>
			{#if saving}
				<p class="h6">Saving...</p>
			{/if}
			<div class="ml-8 flex row gap-12">
				<label class="label my-4">
					<span>First Name</span>
					<input
						class="input"
						type="text"
						placeholder="first name"
						bind:value={firstname}
						on:blur={updateFirstName}
					/>
				</label>
				<label class="label my-4">
					<span>Last Name</span>
					<input
						class="input"
						type="text"
						placeholder="last name"
						bind:value={lastname}
						on:blur={updateLastName}
					/>
				</label>
			</div>
			<div class="ml-8 my-4">
				<label class="label my-4">
					<span>My Public Key</span>
					<input
						class="input active:text-gray-400"
						style="cursor: copy !important;"
						type="text"
						placeholder="first name"
						bind:value={$usersea.pub}
						readonly
						on:click={copyPubKey}
					/>
				</label>
			</div>
			<h3 class="h3">Trustees</h3>
			<div class="ml-8 my-4">
				<div class="flex row gap-4 items-center pb-4 border-b border-b-white-200">
					<p>View Trustees with access to your health records:</p>
					<button class="btn variant-filled-secondary" on:click={viewTrustees}>View</button>
				</div>
				<label class="label my-4">
					<span>Add Public Key of Trustee to Grant Access</span>
					<input class="input" type="text" placeholder="Public Key" bind:value={trusteeToAdd} />
				</label>
				{#if adding}
					<p class="h6">Adding...</p>
				{:else}
					<button class="btn variant-filled-secondary" on:click={addTrustee}> Add </button>
				{/if}
			</div>

			<!-- <label class="label">
				<span>HR</span>
				<input class="input" type="number" placeholder="first name" name="hr" bind:value={hr}/>
			</label>
			<button class="btn variant-filled-secondary mx-4" on:click={ add } > Add </button> -->
			<!-- <h3>Heartrates</h3>
			{#each heartrates as [key, value]}
			<div>{key} : {value}</div>
			{/each} -->
		</div>
	</div>
</div>

<script lang="ts">
	import { user, getSCMRooms } from '$lib/gun-setup';
	import SEA from 'gun/sea';
	import { fly } from 'svelte/transition';
	let store: { [key: number]: string } = {};

	user
		.get('securimed')
		.get('rex')
		.get('hr')
		.map()
		.on(async (data: string, key: number) => {
			const roompair = getSCMRooms();
			const val = await SEA.decrypt(data, roompair);
			store[key] = val;
			console.log('data', key, data);
		});
	function formatDate(timestamp: string) {
		const date = new Date(+timestamp);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: '2-digit',
			timeZone: 'Asia/Shanghai' // GMT+8 timezone
		}).format(date);
	}

	function formatTime(timestamp: string) {
		const date = new Date(+timestamp);
		return new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
			timeZone: 'Asia/Shanghai' // GMT+8 timezone
		}).format(date);
	}
	$: heartrates = Object.entries(store).sort((a: any, b: any) => a[0] - b[0]);
</script>

<div
	class="container h-full mx-auto flex justify-start items-start"
	in:fly={{ x: -20, duration: 300 }}
>
	<div class="space-y-5 w-full">
		<h2 class="h2">Dashboard</h2>
		<div class="table-container">
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Date</th>
						<th>Time</th>
						<th>Heart rate</th>
					</tr>
				</thead>
				<tbody>
					{#each heartrates as [key, value]}
						<tr>
							<td>{formatDate(key)}</td>
							<td>{formatTime(key)}</td>
							<td>{value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

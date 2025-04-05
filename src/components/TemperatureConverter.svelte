<script lang="ts">
	import { useMachine } from '@xstate/svelte';

	import { temperatureMachine } from '../machines/temperature-machine';

	const { snapshot, send } = useMachine(temperatureMachine);

	const handleCelsiusChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'celsius', value: target.value });
	};

	const handleFahrenheitChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'fahrenheit', value: target.value });
	};
</script>

<div class="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-md">
	<h2 class="mb-6 text-center text-2xl font-bold">温度変換器</h2>
	<div class="space-y-4">
		<div>
			<label for="celsius" class="mb-1 block text-sm font-medium text-gray-700"> 摂氏 (°C) </label>
			<input
				id="celsius"
				type="number"
				value={$snapshot.context.celsius ?? ''}
				onchange={handleCelsiusChange}
				placeholder="摂氏を入力"
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="fahrenheit" class="mb-1 block text-sm font-medium text-gray-700">
				華氏 (°F)
			</label>
			<input
				id="fahrenheit"
				type="number"
				value={$snapshot.context.fahrenheit ?? ''}
				onchange={handleFahrenheitChange}
				placeholder="華氏を入力"
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
	</div>
</div>

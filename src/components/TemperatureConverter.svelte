<script lang="ts">
	import { useMachine } from '@xstate/svelte';

	import { temperatureMachine } from '../machines/temperature-machine';

	const { snapshot, send } = useMachine(temperatureMachine);

	const handleCelsiusChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'CELSIUS', value: target.value });
	};

	const handleFahrenheitChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'FAHRENHEIT', value: target.value });
	};
</script>

<div class="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
	<h2 class="text-2xl font-bold text-center mb-6">温度変換器</h2>
	<div class="space-y-4">
		<div>
			<label for="celsius" class="block text-sm font-medium text-gray-700 mb-1"> 摂氏 (°C) </label>
			<input
				id="celsius"
				type="number"
				value={$snapshot.context.celsius ?? ''}
				onchange={handleCelsiusChange}
				placeholder="摂氏を入力"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div>
			<label for="fahrenheit" class="block text-sm font-medium text-gray-700 mb-1">
				華氏 (°F)
			</label>
			<input
				id="fahrenheit"
				type="number"
				value={$snapshot.context.fahrenheit ?? ''}
				onchange={handleFahrenheitChange}
				placeholder="華氏を入力"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	</div>
</div>

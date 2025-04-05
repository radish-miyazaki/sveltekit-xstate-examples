<script lang="ts">
	import { useMachine } from '@xstate/svelte';
	import { Plus, Minus, RotateCcw } from '@lucide/svelte';

	import { counterMachine, type CounterEvent } from '../machines/counter-machine';

	const { snapshot, send } = useMachine(counterMachine);

	let accentColor = $state('bg-gray-400');
	$effect(() => {
		const colors = ['bg-gray-400', 'bg-gray-300', 'bg-gray-200', 'bg-gray-100'];
		accentColor = colors[$snapshot.context.count % colors.length];
	});

	type CounterButtonConfig = {
		type: CounterEvent['type'];
		label: string;
		color: string;
		icon: typeof Minus | typeof Plus | typeof RotateCcw;
	};

	const buttonItems: CounterButtonConfig[] = [
		{
			type: 'INCREMENT',
			icon: Plus,
			label: 'Increment',
			color: 'text-green-600'
		},
		{
			type: 'DECREMENT',
			icon: Minus,
			label: 'Decrement',
			color: 'text-red-600'
		},
		{
			type: 'RESET',
			icon: RotateCcw,
			label: 'Reset',
			color: 'text-blue-600'
		}
	];
</script>

{#snippet button({ type, color, label, icon: Icon }: CounterButtonConfig)}
	<button
		class={`p-3 rounded-full border-2 border-gray-300 ${color} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out`}
		onclick={() => send({ type } as CounterEvent)}
		aria-label={label}
	>
		<Icon class="h-6 w-6" />
	</button>
{/snippet}

<div
	class="bg-white p-12 rounded-lg shadow-2xl transition-all duration-500 ease-in-out hover:shadow-3xl"
>
	<div
		class={`w-48 h-48 rounded-full flex items-center justify-center mb-8 ${accentColor} bg-opacity-10 transition-all duration-300`}
		aria-live="polite"
		aria-label={`Current count is ${$snapshot.context.count}`}
	>
		<span
			class="text-7xl font-light text-gray-800 transition-all duration-300 ease-in-out hover:tracking-wider"
		>
			{$snapshot.context.count}
		</span>
	</div>
	<div class="flex space-x-6 justify-center">
		{#each buttonItems as item (item.type)}
			{@render button(item)}
		{/each}
	</div>
</div>

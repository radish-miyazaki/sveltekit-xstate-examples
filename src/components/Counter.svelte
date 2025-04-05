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
			type: 'increment',
			icon: Plus,
			label: 'Increment',
			color: 'text-green-600'
		},
		{
			type: 'decrement',
			icon: Minus,
			label: 'Decrement',
			color: 'text-red-600'
		},
		{
			type: 'reset',
			icon: RotateCcw,
			label: 'Reset',
			color: 'text-blue-600'
		}
	];
</script>

{#snippet button({ type, color, label, icon: Icon }: CounterButtonConfig)}
	<button
		class={`rounded-full border-2 border-gray-300 p-3 ${color} transition-all duration-300 ease-in-out hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none`}
		onclick={() => send({ type } as CounterEvent)}
		aria-label={label}
	>
		<Icon class="h-6 w-6" />
	</button>
{/snippet}

<div
	class="hover:shadow-3xl rounded-lg bg-white p-12 shadow-2xl transition-all duration-500 ease-in-out"
>
	<div
		class={`mb-8 flex h-48 w-48 items-center justify-center rounded-full ${accentColor} bg-opacity-10 transition-all duration-300`}
		aria-live="polite"
		aria-label={`Current count is ${$snapshot.context.count}`}
	>
		<span
			class="text-7xl font-light text-gray-800 transition-all duration-300 ease-in-out hover:tracking-wider"
		>
			{$snapshot.context.count}
		</span>
	</div>
	<div class="flex justify-center space-x-6">
		{#each buttonItems as item (item.type)}
			{@render button(item)}
		{/each}
	</div>
</div>

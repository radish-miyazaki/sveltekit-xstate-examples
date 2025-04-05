<script lang="ts">
	import { useMachine } from '@xstate/svelte';
	import { Power } from '@lucide/svelte';

	import { toggleMachine } from '../machines/toggle-machine';

	const { snapshot, send } = useMachine(toggleMachine);
	const isActive = $derived($snapshot.value === 'active');
</script>

<button
	onclick={() => send({ type: 'toggle' })}
	class={`
    h-16 w-32 rounded-full p-1 transition-colors duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:outline-none 
    ${isActive ? 'bg-green-500' : 'bg-gray-300'}
  `}
	aria-label={isActive ? 'Turn off' : 'Turn on'}
>
	<div
		class={`flex h-14 w-14 transform items-center justify-center rounded-full transition-transform duration-300 ease-in-out ${
			isActive ? 'translate-x-16 bg-white' : 'translate-x-0 bg-gray-100'
		}`}
	>
		<Power class={`h-8 w-8 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
	</div>
</button>
<span class="mt-4 text-2xl font-bold text-gray-700">
	{isActive ? 'ON' : 'OFF'}
</span>
<span class="sr-only">
	{isActive ? 'The switch is on' : 'The switch is off'}
</span>

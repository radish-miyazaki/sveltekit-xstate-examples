<script lang="ts">
	import { useActor } from '@xstate/svelte';

	import { stopwatchMachine } from '../machines/stopwatch-machine';

	const { snapshot, send } = useActor(stopwatchMachine);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 6000);
		const seconds = Math.floor((time % 6000) / 100);
		const centiseconds = time % 100;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
	};

	const handleStartOrStopClick = () => {
		send({ type: $snapshot.matches('running') ? 'stop' : 'start' });
	};

	const handleResetClick = () => send({ type: 'reset' });
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-gray-800">
	<div
		class="mb-8 flex h-64 w-64 items-center justify-center rounded-full bg-gray-100 shadow-lg md:h-80 md:w-80"
	>
		<div class="font-mono text-4xl font-bold text-gray-700 tabular-nums md:text-5xl">
			{formatTime($snapshot.context.elapsed)}
		</div>
	</div>
	<div class="flex space-x-4">
		<button
			onclick={handleStartOrStopClick}
			class="focus:ring-opacity-50 rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
			aria-label={$snapshot.matches('running') ? 'Stop' : 'Start'}
		>
			{$snapshot.matches('running') ? 'Stop' : 'Start'}
		</button>
		<button
			onclick={handleResetClick}
			class="focus:ring-opacity-50 rounded-full bg-gray-200 px-6 py-2 font-bold text-gray-700 transition duration-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
			aria-label="Reset"
		>
			Reset
		</button>
	</div>
</div>

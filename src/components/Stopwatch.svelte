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
		send({ type: $snapshot.matches('running') ? 'STOP' : 'START' });
	};

	const handleResetClick = () => send({ type: 'RESET' });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
	<div
		class="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-full shadow-lg flex items-center justify-center mb-8"
	>
		<div class="text-4xl md:text-5xl font-bold text-gray-700 font-mono tabular-nums">
			{formatTime($snapshot.context.elapsed)}
		</div>
	</div>
	<div class="flex space-x-4">
		<button
			onclick={handleStartOrStopClick}
			class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
			aria-label={$snapshot.matches('running') ? 'Stop' : 'Start'}
		>
			{$snapshot.matches('running') ? 'Stop' : 'Start'}
		</button>
		<button
			onclick={handleResetClick}
			class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
			aria-label="Reset"
		>
			Reset
		</button>
	</div>
</div>

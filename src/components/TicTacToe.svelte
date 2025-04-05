<script lang="ts">
	import { useMachine } from '@xstate/svelte';
	import { X, Circle } from '@lucide/svelte';

	import { tickTacToeMachine } from '../machines/tick-tac-toe-machine';

	const { snapshot, send } = useMachine(tickTacToeMachine);
	const { board, player, winner } = $derived($snapshot.context);
</script>

{#snippet cellButton({ index, value }: { index: number; value: string | null })}
	<button
		class="flex h-24 w-24 transform items-center justify-center border-2 border-gray-200 bg-white text-4xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-50"
		onclick={() => send({ type: 'play', value: index })}
		disabled={!!value || $snapshot.hasTag('winner') || $snapshot.hasTag('draw')}
	>
		{#if value === 'x'}
			<X class="h-16 w-16 text-blue-600" />
		{:else if value === 'o'}
			<Circle class="h-16 w-16 text-red-600" />
		{/if}
	</button>
{/snippet}

<div class="flex min-h-screen items-center justify-center bg-white font-sans">
	<div class="w-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
		<h1 class="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-800">○×ゲーム</h1>
		<div class="mb-8 grid grid-cols-3 gap-4">
			{#each board as cell, index (index)}
				{@render cellButton({ index, value: cell })}
			{/each}
		</div>
		<div class="text-center">
			{#if $snapshot.hasTag('winner')}
				<p
					class="mb-6 animate-pulse text-2xl font-bold"
					style:color={winner === 'x' ? '#2563EB' : '#DC2626'}
				>
					プレイヤー {winner === 'x' ? '✗' : '○'} の勝利です！
				</p>
			{:else if $snapshot.hasTag('draw')}
				<p class="mb-6 animate-pulse text-2xl font-bold text-gray-600">引き分けです！</p>
			{:else}
				<p class="mb-6 text-2xl font-semibold text-gray-700">
					現在のプレイヤー: <span style:color={player === 'x' ? '#2563EB' : '#DC2626'}>
						{player === 'x' ? '✗' : '○'}
					</span>
				</p>
			{/if}
			<button
				onclick={() => send({ type: 'reset' })}
				class="transform rounded-full bg-gradient-to-r from-blue-500 to-red-500 px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-red-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				ゲームをリセット
			</button>
		</div>
	</div>
</div>

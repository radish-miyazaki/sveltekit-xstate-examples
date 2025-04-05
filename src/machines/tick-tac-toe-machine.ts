import { assign, setup, type EventObject } from 'xstate';

function assertEvent<TEvent extends EventObject, Type extends TEvent['type']>(
	ev: TEvent,
	type: Type
): asserts ev is Extract<TEvent, { type: Type }> {
	if (ev.type !== type) {
		throw new Error('Unexpected event type.');
	}
}

type Player = 'x' | 'o';

type TickTacToeEvent = { type: 'PLAY'; value: number } | { type: 'RESET' };

export type TickTacToeContext = {
	board: Array<Player | null>;
	moves: number;
	player: Player;
	winner?: Player;
};

const initialContext: TickTacToeContext = {
	board: Array(9).fill(null),
	moves: 0,
	player: 'x'
};

export const tickTacToeMachine = setup({
	types: {} as {
		context: TickTacToeContext;
		events: TickTacToeEvent;
	},
	actions: {
		updateBoard: assign({
			board: ({ context, event }) => {
				assertEvent(event, 'PLAY');
				const updatedBoard = [...context.board];
				updatedBoard[event.value] = context.player;
				return updatedBoard;
			},
			moves: ({ context }) => context.moves + 1,
			player: ({ context }) => (context.player === 'x' ? 'o' : 'x')
		}),
		resetGame: assign(initialContext),
		setWinner: assign({
			winner: ({ context }) => (context.player === 'x' ? 'o' : 'x')
		})
	},
	guards: {
		checkWin: ({ context }) => {
			const { board } = context;
			const winningLines = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6]
			];

			for (const line of winningLines) {
				const xWon = line.every((index) => board[index] === 'x');
				if (xWon) return true;

				const oWon = line.every((index) => board[index] === 'o');
				if (oWon) return true;
			}

			return false;
		},
		checkDraw: ({ context }) => {
			return context.moves === 9;
		},
		isValidMore: ({ context, event }) => {
			if (event.type !== 'PLAY') return false;

			return context.board[event.value] === null;
		}
	}
}).createMachine({
	id: 'tickTacToe',
	initial: 'playing',
	context: initialContext,
	states: {
		playing: {
			always: [
				{ target: 'gameOver.winner', guard: 'checkWin' },
				{ target: 'gameOver.draw', guard: 'checkDraw' }
			],
			on: {
				PLAY: [
					{
						target: 'playing',
						guard: 'isValidMore',
						actions: 'updateBoard'
					}
				]
			}
		},
		gameOver: {
			initial: 'winner',
			states: {
				winner: {
					tags: 'winner',
					entry: 'setWinner'
				},
				draw: {
					tags: 'draw'
				}
			},
			on: {
				RESET: {
					target: 'playing',
					actions: 'resetGame'
				}
			}
		}
	}
});

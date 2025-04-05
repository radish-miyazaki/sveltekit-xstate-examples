import { assign, fromCallback, setup } from 'xstate';

type StopwatchContext = {
	elapsed: number;
};

export type StopwatchEvent =
	| { type: 'start' }
	| { type: 'stop' }
	| { type: 'reset' }
	| { type: 'tick' };

export const stopwatchMachine = setup({
	types: {} as {
		context: StopwatchContext;
		events: StopwatchEvent;
	},
	actors: {
		ticks: fromCallback(({ sendBack }) => {
			const interval = setInterval(() => sendBack({ type: 'TICK' }), 10);
			return () => clearInterval(interval);
		})
	}
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5SwC4HsAOB3AhigxgBYDEASgKIDK5AKgNoAMAuoqBmrAJYqdoB2rEAA9EAWgCMAdgBMAOgYAOBgGYArMskKAbFoCcW6VoA0IAJ6IALBd2yL25Totqd03RYC+7k6ky4ChWR8MDEhiShoAQVJ6ZkF2Lh5+QREEaUlJWS0Fa3FpZQYnBRNzVNzZB10FSXE9Cy1VBmlxT290bDwiWQAnAFc+Pk4+KGIaAEkAYQBpRhYkEHjuXgE5lLSMyTdpKvzC4sR81UzKg2ktmQZdZWUWkCC-Tt7+weHwgHkABRm4jkWklcQtuJZAolKc7AVlEpxHsEOJGrIGpI1BZquILOIqs0bnw0BA4II7h1CN8EktkmJTgx5Eo1BptHoDMYzIhxIcGAwkXVlGsHNcvLc2vcAkEQhASb9lqAUhJlOU1KpdLp1FpuVp0TCUXImq4tpdVC43DdCf5un0BkNxYlJcJEKpVBk6loGOJxJDVOi3Bq7LJqjqFHqdHzPEA */
	id: 'stopwatch',
	initial: 'stopped',
	context: { elapsed: 0 },
	states: {
		stopped: {
			on: { start: 'running' }
		},
		running: {
			invoke: {
				src: 'ticks'
			},
			on: {
				tick: {
					actions: assign({
						elapsed: ({ context }) => context.elapsed + 1
					})
				},
				stop: 'stopped'
			}
		}
	},
	on: {
		reset: {
			actions: assign({ elapsed: 0 }),
			target: '.stopped'
		}
	}
});

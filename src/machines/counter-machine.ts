import { assign, setup } from 'xstate';

type CounterContext = {
	count: number;
};

export type CounterEvent = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

export const counterMachine = setup({
	types: {} as {
		context: CounterContext;
		events: CounterEvent;
	}
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFzAJwGIBJAOQGEAlAUQFkqSAVAbQAYBdRUAB1VgEtsfVJk4gAHogCMAFgB0AZgBsAdkkAOZQFYANCACeiAEwt5sgJwtFhzQF8butFlyEAIlUq16zdqJ79BwqISCJKGugYhLMrmmvKhtvYgjjj4BNQAylTeHEggfgJCIrnB8nKaVjr6UoZ2iZioEHCiyc6+vAWBxYjyhrKKLGbyWuHdLHJqmoNatTZAA */
	id: 'counter',
	context: { count: 0 },
	on: {
		INCREMENT: {
			actions: assign({
				count: ({ context }) => context.count + 1
			})
		},
		DECREMENT: {
			actions: assign({
				count: ({ context }) => context.count - 1
			})
		},
		RESET: {
			actions: assign({ count: 0 })
		}
	}
});

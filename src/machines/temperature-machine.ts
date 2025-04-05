import { assign, setup } from 'xstate';

type TemperatureContext = {
	celsius?: number | string;
	fahrenheit?: number | string;
};

type TemperatureEvent =
	| {
			type: 'celsius';
			value: string;
	  }
	| {
			type: 'fahrenheit';
			value: string;
	  };

export const temperatureMachine = setup({
	types: {} as {
		context: TemperatureContext;
		events: TemperatureEvent;
	}
}).createMachine({
	context: { celsius: undefined, fahrenheit: undefined },
	on: {
		celsius: {
			actions: assign({
				celsius: ({ event }) => event.value,
				fahrenheit: ({ event }) => (event.value.length ? +event.value * (9 / 5) + 32 : '')
			})
		},
		fahrenheit: {
			actions: assign({
				celsius: ({ event }) => (event.value.length ? (+event.value - 32) * (5 / 9) : ''),
				fahrenheit: ({ event }) => event.value
			})
		}
	}
});

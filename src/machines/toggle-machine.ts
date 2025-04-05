import { setup } from 'xstate';

export type ToggleEvent = { type: 'TOGGLE' };

export const toggleMachine = setup({
	types: {} as {
		events: ToggleEvent;
	}
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QBcD2UoBswDoCWAdgIYDGyeAbmAMQAqA8gOKMAyAogNoAMAuoqAAdUsPOVQF+IAB6IAjAFYA7Di6rVAJgCcmgBwAWebN0AaEAE85AZnUq1XdfN0A2efoC+b02gzYcpclR0TKycvJJCImISSNJySrZqWroGRjqmFgg6sjjydrKWCrqK6joeniAEqBBwkt5YYOHConjikjIIALRO6Ygd8jjag0PDlh5e6PX4xGSUDTERza0x7XrqPZnKrpbbejpOllzasnpjIHW+-rONkS3RoO0lXDiWjpZZ6oryelzd5oiaTy4Om2ll2+0OmmOZTcQA */
	id: 'toggle',
	initial: 'inactive',
	states: {
		inactive: {
			on: { TOGGLE: 'active' }
		},
		active: {
			on: { TOGGLE: 'inactive' }
		}
	}
});

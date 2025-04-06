import { assign, setup } from 'xstate';

export type TodoItem = {
	id: string;
	title: string;
	completed: boolean;
};

export type TodosFilter = 'all' | 'active' | 'completed';

type TodoContext = {
	todo: string;
	todos: TodoItem[];
	filter: TodosFilter;
};

type TodoEvent =
	| { type: 'newTodo.change'; value: string }
	| { type: 'newTodo.add'; value: string }
	| { type: 'todo.edit'; todo: TodoItem }
	| { type: 'todo.editCommit' }
	| { type: 'todo.delete'; id: string }
	| { type: 'todo.toggle'; id: string }
	| { type: 'todo.markAll'; completed: boolean }
	| { type: 'todos.clearCompleted' }
	| { type: 'filter.change'; filter: TodosFilter };

export const todosMachine = setup({
	types: {} as {
		context: TodoContext;
		events: TodoEvent;
	}
}).createMachine({
	id: 'todos',
	context: {
		todo: '',
		todos: [],
		filter: 'all'
	},
	on: {
		'newTodo.change': {
			actions: assign({
				todo: ({ event }) => event.value
			})
		},
		'newTodo.add': {
			guard: ({ event }) => event.value.trim().length > 0,
			actions: assign({
				todo: '',
				todos: ({ context, event }) => {
					const newTodo: TodoItem = {
						id: Math.random().toString(36).substring(7),
						title: event.value,
						completed: false
					};

					return [...context.todos, newTodo];
				}
			})
		},
		'todo.edit': {
			actions: assign({
				todos: ({ context, event }) => {
					const updatedTodo = event.todo;
					return context.todos.map((todo) => {
						if (todo.id === updatedTodo.id) return updatedTodo;

						return todo;
					});
				}
			})
		},
		'todo.editCommit': {
			actions: assign({
				todos: ({ context }) => {
					// 確定時に空白の場合は削除する
					return context.todos.filter((todo) => todo.title.trim().length > 0);
				}
			})
		},
		'todo.delete': {
			actions: assign({
				todos: ({ context, event }) => {
					return context.todos.filter((todo) => todo.id !== event.id);
				}
			})
		},
		'todo.toggle': {
			actions: assign({
				todos: ({ context, event }) => {
					return context.todos.map((todo) => {
						if (todo.id === event.id) return { ...todo, completed: !todo.completed };

						return todo;
					});
				}
			})
		},
		'todo.markAll': {
			actions: assign({
				todos: ({ context, event }) => {
					return context.todos.map((todo) => ({ ...todo, completed: event.completed }));
				}
			})
		},
		'todos.clearCompleted': {
			actions: assign({
				todos: ({ context }) => context.todos.filter((todo) => !todo.completed)
			})
		},
		'filter.change': {
			actions: assign({
				filter: ({ event }) => event.filter
			})
		}
	}
});

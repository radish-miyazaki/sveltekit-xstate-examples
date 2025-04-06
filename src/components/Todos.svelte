<script lang="ts">
	import { useMachine } from '@xstate/svelte';
	import { todosMachine, type TodoItem } from '../machines/todos-machine';

	let editingId: string | undefined = $state(undefined);

	const { snapshot, send } = useMachine(todosMachine);
	const { todos, todo, filter } = $derived($snapshot.context);
	const activeTodos = $derived(todos.filter((todo) => !todo.completed));
	const filteredTodos = $derived(
		todos.filter((todo) => {
			if (filter === 'active') return !todo.completed;

			if (filter === 'completed') return todo.completed;

			return true;
		})
	);
	const completedTodos = $derived(todos.filter((todo) => todo.completed));

	const handleNewTodoInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'newTodo.change', value: target.value });
	};

	const handleNewTodoInputKeypress = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		if (e.key === 'Enter') send({ type: 'newTodo.add', value: target.value });
	};

	const handleTodoInput = (e: Event, item: TodoItem) => {
		const target = e.target as HTMLInputElement;
		send({ type: 'todo.edit', todo: { ...item, title: target.value } });
	};

	const handleTodoInputKeypress = (e: KeyboardEvent) => {
		if (e.key !== 'Enter') return;

		send({ type: 'todo.editCommit' });
		editingId = undefined;
	};

	const handleTodoInputBlur = () => {
		send({ type: 'todo.editCommit' });
		editingId = undefined;
	};
</script>

{#snippet todoListItem(item: TodoItem)}
	<li
		class="mb-3 flex items-center rounded-md bg-gray-50 p-2 transition-colors duration-200 hover:bg-gray-100"
	>
		<div class="flex min-w-0 flex-grow items-center">
			<input
				type="checkbox"
				checked={item.completed}
				onchange={() => send({ type: 'todo.toggle', id: item.id })}
				class="mr-3 h-5 w-5 flex-shrink-0 text-blue-600"
				aria-label={`Mark "${item.title}" as ${item.completed ? 'active' : 'completed'}`}
			/>
			{#if editingId === item.id}
				<input
					type="text"
					value={item.title}
					oninput={(e) => handleTodoInput(e, item)}
					onblur={handleTodoInputBlur}
					onkeypress={handleTodoInputKeypress}
					class="w-full rounded-md border border-gray-300 px-2 py-1 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
					aria-label={`Edit todo "${item.title}"`}
				/>
			{:else}
				<span
					role="button"
					ondblclick={() => (editingId = item.id)}
					tabindex="0"
					class={`block w-full truncate text-lg ${
						item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
					}`}
				>
					{item.title}
				</span>
			{/if}
		</div>
		<button
			onclick={() => send({ type: 'todo.delete', id: item.id })}
			class="ml-2 flex-shrink-0 text-xl font-bold text-red-500 hover:text-red-700"
			aria-label={`Delete todo "${item.title}"`}
		>
			×
		</button>
	</li>
{/snippet}

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<div class="w-full w-md rounded-lg bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-3xl font-bold text-gray-800">Todo App</h1>
		<!-- new todo field -->
		<input
			type="text"
			value={todo}
			oninput={handleNewTodoInput}
			onkeydown={handleNewTodoInputKeypress}
			placeholder="What needs to be done?"
			class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
			aria-label="New todo input"
		/>

		<!-- todo lists -->
		<ul class="mb-4" role="list" aria-label="Todo list">
			{#each filteredTodos as item}
				{@render todoListItem(item)}
			{/each}
		</ul>

		<!-- filter -->
		<div class="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600">
			<span class="mb-2 sm:mb-0">{activeTodos.length} items left</span>
			<div class="mb-2 flex space-x-2 sm:mb-0">
				<button
					onclick={() => send({ type: 'filter.change', filter: 'all' })}
					class={`rounded-md px-3 py-1 ${
						filter === 'all'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					aria-pressed={filter === 'all'}
				>
					All
				</button>
				<button
					onclick={() => send({ type: 'filter.change', filter: 'active' })}
					class={`rounded-md px-3 py-1 ${
						filter === 'active'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					aria-pressed={filter === 'active'}
				>
					Active
				</button>
				<button
					onclick={() => send({ type: 'filter.change', filter: 'completed' })}
					class={`rounded-md px-3 py-1 ${
						filter === 'completed'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					aria-pressed={filter === 'completed'}
				>
					Completed
				</button>
			</div>
			{#if completedTodos.length > 0}
				<button
					onclick={() => send({ type: 'todos.clearCompleted' })}
					class="rounded-md bg-red-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-red-600"
				>
					Clear completed
				</button>
			{/if}
		</div>
	</div>
</div>

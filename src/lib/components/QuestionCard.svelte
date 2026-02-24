<script lang="ts">
	import type { Question } from '$lib/data/questions';

	let {
		question,
		index,
		total,
		onsubmit
	}: {
		question: Question;
		index: number;
		total: number;
		onsubmit: (answer: string) => void;
	} = $props();

	let input = $state('');
	let disabled = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!input.trim() || disabled) return;
		disabled = true;
		onsubmit(input);
	}

	export function reset() {
		input = '';
		disabled = false;
	}
</script>

<div class="question-card">
	<div class="counter">{index + 1} / {total}</div>
	<h2 class="prompt">{question.prompt}</h2>
	<form onsubmit={handleSubmit}>
		<input
			type="text"
			bind:value={input}
			placeholder="Type your answer..."
			{disabled}
			autofocus
		/>
	</form>
	<div class="hint">Press Enter to submit</div>
</div>

<style>
	.question-card {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.counter {
		color: var(--text-dim);
		font-size: 0.875rem;
	}
	.prompt {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-bright);
		line-height: 1.3;
	}
	.hint {
		color: var(--text-dim);
		font-size: 0.75rem;
	}
</style>

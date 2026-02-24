<script lang="ts">
	import { onMount } from 'svelte';

	let {
		correct,
		canonical,
		example,
		roleLocked,
		docsUrl,
		oncontinue,
		onresults
	}: {
		correct: boolean;
		canonical?: string;
		example?: string;
		roleLocked: boolean;
		docsUrl?: string;
		oncontinue: () => void;
		onresults: () => void;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			oncontinue();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<div class="feedback" class:correct class:wrong={!correct}>
	{#if correct}
		<div class="result-line correct-text">Correct!</div>
		<div class="canonical">{canonical}</div>
	{:else}
		<div class="result-line wrong-text">Wrong.</div>
		{#if example}
			<div class="example">Example answer: <strong>{example}</strong></div>
		{/if}
		{#if roleLocked}
			<div class="locked-msg">Your role has been locked.</div>
		{/if}
		{#if docsUrl}
			<div class="docs"><a href={docsUrl} target="_blank" rel="noopener">Learn more</a></div>
		{/if}
		<div class="hint">Press Enter to continue</div>
	{/if}
</div>

<style>
	.feedback {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem;
		border: 1px solid var(--border);
	}
	.feedback.correct {
		border-color: var(--accent);
	}
	.feedback.wrong {
		border-color: var(--error);
	}
	.result-line {
		font-size: 1.25rem;
		font-weight: 700;
	}
	.correct-text {
		color: var(--accent);
	}
	.wrong-text {
		color: var(--error);
	}
	.canonical {
		color: var(--text-dim);
	}
	.example strong {
		color: var(--text-bright);
	}
	.locked-msg {
		color: var(--error);
		font-size: 0.875rem;
	}
	.docs {
		font-size: 0.875rem;
	}
	.hint {
		color: var(--text-dim);
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}
</style>

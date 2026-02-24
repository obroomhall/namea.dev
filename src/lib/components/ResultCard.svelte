<script lang="ts">
	import { getRoleLabel, ROLES } from '$lib/engine/roles';
	import type { AnswerRecord } from '$lib/stores/quiz';
	import { getCommentary } from '$lib/utils/commentary';

	let {
		actualRole,
		achievedRoleId,
		answers,
		onrestart,
		onshare
	}: {
		actualRole: string;
		achievedRoleId: string | null;
		answers: AnswerRecord[];
		onrestart: () => void;
		onshare: () => void;
	} = $props();

	const correctCount = $derived(answers.filter((a) => a.correct).length);
	const achievedLabel = $derived(achievedRoleId ? getRoleLabel(achievedRoleId) : 'Nothing');
	const achievedIndex = $derived(ROLES.findIndex((r) => r.id === achievedRoleId));
	const commentary = $derived(getCommentary(actualRole, achievedRoleId, correctCount, answers.length));
</script>

<div class="result-card">
	<h1>Results</h1>

	<div class="role-comparison-wrapper">
		<div class="role-comparison">
			<div class="role-block">
				<span class="role-label">You said you're a</span>
				<span class="role-value actual">{actualRole}</span>
			</div>
			<div class="arrow">→</div>
			<div class="role-block">
				<span class="role-label">You proved you're a</span>
				<span class="role-value achieved" class:none={!achievedRoleId}>{achievedLabel}</span>
			</div>
		</div>
	</div>

	<div class="score">{correctCount} / {answers.length} correct</div>

	<p class="commentary">{commentary}</p>

	<div class="answer-list">
		{#each answers as answer, i}
			<div
				class="answer-row"
				class:correct={answer.correct}
				class:wrong={!answer.correct}
				style="animation-delay: {i * 40}ms"
			>
				<span class="answer-index">{i + 1}.</span>
				<span class="answer-role">{getRoleLabel(answer.roleId)}</span>
				<span class="answer-input">{answer.input}</span>
				<span class="answer-status">{answer.correct ? '✓' : '✗'}</span>
				{#if answer.correct && answer.canonical}
					<span class="answer-canonical">{answer.canonical}</span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="actions">
		<button class="primary" onclick={onshare}>Copy share link</button>
		<button onclick={onrestart}>Restart</button>
	</div>
</div>

<style>
	.result-card {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	h1 {
		font-size: 1.5rem;
		color: var(--text-bright);
	}
	.role-comparison-wrapper {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.role-comparison {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.role-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.role-label {
		font-size: 0.75rem;
		color: var(--text-dim);
	}
	.role-value {
		font-size: 1.25rem;
		font-weight: 700;
	}
	.role-value.actual {
		color: var(--text-bright);
	}
	.role-value.achieved {
		color: var(--accent);
	}
	.role-value.none {
		color: var(--error);
	}
	.arrow {
		color: var(--text-dim);
		font-size: 1.5rem;
	}
	.score {
		color: var(--text-dim);
		font-size: 1rem;
	}
	.commentary {
		color: var(--text);
		font-style: italic;
		line-height: 1.5;
	}
	.answer-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
	}
	.answer-row {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
		padding: 0.35rem 0.5rem;
		border-bottom: 1px solid var(--border);
		border-left: 2px solid transparent;
		animation: slide-up 250ms ease-out both;
	}
	.answer-row.correct {
		border-left-color: var(--accent);
	}
	.answer-row.wrong {
		border-left-color: var(--error);
	}
	.answer-index {
		color: var(--text-dim);
		min-width: 1.5rem;
	}
	.answer-role {
		color: var(--text-dim);
		min-width: 10rem;
	}
	.answer-input {
		color: var(--text);
		flex: 1;
	}
	.answer-status {
		font-weight: 700;
	}
	.correct .answer-status {
		color: var(--accent);
	}
	.wrong .answer-status {
		color: var(--error);
	}
	.answer-canonical {
		color: var(--text-dim);
		font-size: 0.75rem;
	}
	.actions {
		display: flex;
		gap: 0.75rem;
	}
</style>

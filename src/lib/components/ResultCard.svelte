<script lang="ts">
	import { getRoleLabel, ROLES } from '$lib/engine/roles';
	import { QUESTIONS } from '$lib/data/questions';
	import type { AnswerRecord } from '$lib/stores/quiz';
	import type { QuestionReachStats } from '$lib/utils/reach';
	import { getCommentary } from '$lib/utils/commentary';

	let {
		actualRole,
		achievedRoleId,
		answers,
		questionStats,
		onrestart,
		onshare
	}: {
		actualRole: string;
		achievedRoleId: string | null;
		answers: AnswerRecord[];
		questionStats?: QuestionReachStats[];
		onrestart: () => void;
		onshare: () => void;
	} = $props();

	const answerByRoleId = $derived(new Map(answers.map((a) => [a.roleId, a])));
	const correctCount = $derived(answers.filter((a) => a.correct).length);
	const achievedLabel = $derived(achievedRoleId ? getRoleLabel(achievedRoleId) : 'Nothing');
	const achievedIndex = $derived(ROLES.findIndex((r) => r.id === achievedRoleId));
	const commentary = $derived(getCommentary(actualRole, achievedRoleId, correctCount, QUESTIONS.length));
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

	<div class="score">{correctCount} / {QUESTIONS.length} correct</div>

	<p class="commentary">{commentary}</p>

	<div class="answer-list">
		{#each QUESTIONS as question, i}
			{@const answer = answerByRoleId.get(question.roleId)}
			{#if answer && answer.correct}
				<div
					class="answer-row correct"
					style="animation-delay: {i * 40}ms"
				>
					<span class="answer-index">{i + 1}.</span>
					<span class="answer-role">{getRoleLabel(answer.roleId)}</span>
					<span class="answer-input">{answer.input}</span>
					<span class="answer-status">✓</span>
					{#if answer.canonical}
						<span class="answer-canonical">{answer.canonical}</span>
					{/if}
					{#if question.docsUrl}
						<a class="answer-docs" href={question.docsUrl} target="_blank" rel="noopener">?</a>
					{/if}
				</div>
			{:else if answer && !answer.correct && answer.input !== '(skipped)'}
				<div
					class="answer-row wrong"
					style="animation-delay: {i * 40}ms"
				>
					<span class="answer-index">{i + 1}.</span>
					<span class="answer-role">{getRoleLabel(answer.roleId)}</span>
					<span class="answer-input">{answer.input}</span>
					<span class="answer-status">✗</span>
					{#if question.docsUrl}
						<a class="answer-docs" href={question.docsUrl} target="_blank" rel="noopener">?</a>
					{/if}
				</div>
			{:else}
				<div
					class="answer-row unanswered"
					style="animation-delay: {i * 40}ms"
				>
					<span class="answer-index">{i + 1}.</span>
					<span class="answer-role">{getRoleLabel(question.roleId)}</span>
					<span class="answer-input unanswered-prompt">{question.prompt}</span>
					{#if question.docsUrl}
						<a class="answer-docs" href={question.docsUrl} target="_blank" rel="noopener">?</a>
					{/if}
				</div>
			{/if}
			{#if questionStats?.[i]}
				<div class="reach-stats" style="animation-delay: {i * 40}ms">
					<div class="reach-row">
						<div class="reach-track">
							<div class="reach-bar reach-bar-all" style="width: {questionStats[i].allPercent}%"></div>
						</div>
						<span class="reach-label">{questionStats[i].allPercent}% of all</span>
					</div>
					{#if questionStats[i].rolePercent != null}
						<div class="reach-row">
							<div class="reach-track">
								<div class="reach-bar reach-bar-role" style="width: {questionStats[i].rolePercent}%"></div>
							</div>
							<span class="reach-label">{questionStats[i].rolePercent}% of {actualRole}s</span>
						</div>
					{/if}
				</div>
			{/if}
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
	.answer-docs {
		color: var(--text-dim);
		font-size: 0.7rem;
		opacity: 0.4;
		text-decoration: none;
		flex-shrink: 0;
	}
	.answer-docs:hover {
		opacity: 1;
		color: var(--accent);
	}
	.answer-row.unanswered {
		opacity: 0.4;
	}
	.unanswered-prompt {
		font-style: italic;
	}
	.reach-stats {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 0 0.5rem 0.35rem 2rem;
		animation: slide-up 250ms ease-out both;
	}
	.reach-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.reach-track {
		flex: 1;
		height: 3px;
		background: var(--border);
		border-radius: 1px;
		overflow: hidden;
	}
	.reach-bar {
		height: 100%;
		border-radius: 1px;
		min-width: 1px;
		transition: width 600ms ease-out;
	}
	.reach-bar-all {
		background: var(--text-dim);
		opacity: 0.5;
	}
	.reach-bar-role {
		background: var(--accent);
		opacity: 0.6;
	}
	.reach-label {
		font-size: 0.6rem;
		color: var(--text-dim);
		white-space: nowrap;
		opacity: 0.6;
		flex-shrink: 0;
	}
	.actions {
		display: flex;
		gap: 0.75rem;
	}

	@media (max-width: 480px) {
		.role-comparison {
			gap: 0.5rem;
		}
		.role-value {
			font-size: 1.1rem;
		}
		.arrow {
			font-size: 1.25rem;
		}
		.answer-row {
			flex-wrap: wrap;
			padding: 0.5rem;
			gap: 0.25rem 0.5rem;
		}
		.answer-role {
			min-width: auto;
		}
		.answer-input {
			flex-basis: 100%;
			padding-left: 0;
		}
		.reach-stats {
			padding-left: 0.5rem;
		}
		.actions {
			flex-direction: column;
		}
		.actions button {
			width: 100%;
		}
	}
</style>

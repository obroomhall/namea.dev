<script lang="ts">
	import { QUESTIONS } from '$lib/data/questions';
	import { getRoleLabel } from '$lib/engine/roles';

	let {
		achievedRoleId,
		currentIndex,
		answeredCount = 0,
		roleLocked = false,
		actualRole,
		onjump
	}: {
		achievedRoleId: string | null;
		currentIndex: number;
		answeredCount?: number;
		roleLocked?: boolean;
		actualRole?: string;
		onjump?: (index: number) => void;
	} = $props();

	// Find the index of the achieved role (last correct answer)
	const achievedIndex = $derived(
		achievedRoleId ? QUESTIONS.findIndex((q) => q.roleId === achievedRoleId) : -1
	);

	function getNodeState(i: number): 'achieved' | 'failed' | 'current' | 'future' {
		if (i === currentIndex) return 'current';
		if (i < answeredCount) {
			return i <= achievedIndex ? 'achieved' : 'failed';
		}
		return 'future';
	}

	function isClickable(i: number): boolean {
		if (!onjump || i === currentIndex) return false;
		// Already-answered questions are always navigable
		if (i < answeredCount) return true;
		// The frontier (next unanswered) is always navigable
		if (i === answeredCount) return true;
		// Unanswered future questions only when role is locked
		return roleLocked && i > answeredCount;
	}

	function handleClick(i: number) {
		if (isClickable(i)) onjump?.(i);
	}

	function handleKeydown(e: KeyboardEvent, i: number) {
		if ((e.key === 'Enter' || e.key === ' ') && isClickable(i)) {
			e.preventDefault();
			onjump?.(i);
		}
	}
</script>

<div class="progress-wrapper">
	<div class="labels">
		<span class="label-current">{getRoleLabel(QUESTIONS[currentIndex]?.roleId)}</span>
		{#if actualRole}
			<span class="label-claimed">{actualRole}</span>
		{/if}
	</div>
	<div class="progress-bar">
		{#each QUESTIONS as q, i}
			{@const state = getNodeState(i)}
			{@const clickable = isClickable(i)}
			{#if i > 0}
				<div class="connector" class:achieved={i <= achievedIndex && i < answeredCount}></div>
			{/if}
			<button
				class="node {state}"
				class:clickable
				class:active={i === currentIndex}
				class:frontier={i === answeredCount && currentIndex !== answeredCount && i < QUESTIONS.length}
				title={getRoleLabel(q.roleId)}
				disabled={!clickable}
				onclick={() => handleClick(i)}
				onkeydown={(e) => handleKeydown(e, i)}
			></button>
		{/each}
	</div>
</div>

<style>
	.progress-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.labels {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.label-current {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
	}
	.label-claimed {
		font-size: 0.75rem;
		color: var(--text-dim);
	}
	.progress-bar {
		display: flex;
		align-items: center;
		gap: 0;
		width: 100%;
		overflow: visible;
		padding: 0;
	}
	.connector {
		flex: 1;
		height: 2px;
		min-width: 0.5rem;
		background: var(--border);
		transition: background 0.3s;
	}
	.connector.achieved {
		background: var(--accent);
	}
	.node {
		position: relative;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid var(--border);
		background: transparent;
		padding: 0;
		flex-shrink: 0;
		cursor: default;
		font-family: inherit;
		transition: border-color 0.15s, background 0.15s;
	}
	.node::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 32px;
		height: 32px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
	}
	.node.achieved {
		background: var(--accent);
		border-color: var(--accent);
	}
	.node.failed {
		background: var(--error);
		border-color: var(--error);
	}
	.node.current {
		border-color: var(--accent);
		animation: pulse-glow 2s ease-in-out infinite;
	}
	.node.frontier {
		border-color: var(--accent);
		opacity: 0.7;
		animation: pulse-glow 2s ease-in-out infinite;
		cursor: pointer;
	}
	.node.frontier:hover {
		opacity: 1;
	}
	.node.future {
		opacity: 0.4;
	}
	.node.clickable {
		cursor: pointer;
		opacity: 0.6;
	}
	.node.clickable:hover {
		opacity: 1;
		border-color: var(--text-dim);
	}

	@media (max-width: 480px) {
		.node {
			width: 12px;
			height: 12px;
		}
		.connector {
			min-width: 0.25rem;
		}
		.label-current {
			font-size: 0.75rem;
		}
		.label-claimed {
			font-size: 0.65rem;
		}
	}
</style>

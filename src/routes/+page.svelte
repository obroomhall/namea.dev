<script lang="ts">
	import { goto } from '$app/navigation';
	import { ACTUAL_ROLES } from '$lib/engine/roles';
	import { config } from '$lib/data/config';
	import { quiz } from '$lib/stores/quiz';
	import { onMount } from 'svelte';

	let hasExistingSession = $state(false);

	onMount(() => {
		quiz.init();
		const unsub = quiz.subscribe((s) => {
			if (s.actualRole && !s.completed) {
				hasExistingSession = true;
			}
		});
		return unsub;
	});

	function start(role: string) {
		if (!role) return;
		quiz.start(role);
		goto('/quiz');
	}

	function resumeQuiz() {
		goto('/quiz');
	}
</script>

<div class="container landing">
	<header class="entrance entrance-1">
		<h1><span class="accent">{config.branding.titleAccent}</span>{config.branding.titleSuffix}</h1>
	</header>

	{#if hasExistingSession}
		<div class="resume entrance entrance-2">
			<button class="primary" onclick={resumeQuiz}>Resume quiz</button>
			<button onclick={() => { hasExistingSession = false; }}>Start fresh</button>
		</div>
	{:else}
		<div class="start-form entrance entrance-2">
			<select id="role-select" onchange={(e) => start(e.currentTarget.value)}>
				<option value="" disabled selected>Pick your role...</option>
				{#each ACTUAL_ROLES as role}
					<option value={role}>{role}</option>
				{/each}
			</select>
		</div>
	{/if}

	{#if config.branding.repoUrl}
		<a class="repo-link entrance entrance-3" href={config.branding.repoUrl} target="_blank" rel="noopener">GitHub</a>
	{/if}
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		min-height: 100vh;
		justify-content: center;
	}
	header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text-bright);
	}
	.accent {
		color: var(--accent);
	}
.start-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
.resume {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
.entrance {
		animation: slide-up 250ms ease-out both;
	}
	.entrance-1 {
		animation-delay: 0ms;
	}
	.entrance-2 {
		animation-delay: 80ms;
	}
	.entrance-3 {
		animation-delay: 160ms;
	}
	.repo-link {
		color: var(--text-dim);
		font-size: 0.75rem;
		text-decoration: none;
	}
	.repo-link:hover {
		color: var(--accent);
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 1.75rem;
		}
		.landing {
			gap: 1.5rem;
		}
	}
</style>

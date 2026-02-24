<script lang="ts">
	import { goto } from '$app/navigation';
	import { ACTUAL_ROLES } from '$lib/engine/roles';
	import { quiz } from '$lib/stores/quiz';
	import { onMount } from 'svelte';

	let selectedRole = $state('');
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

	function start() {
		if (!selectedRole) return;
		quiz.start(selectedRole);
		goto('/quiz');
	}

	function resumeQuiz() {
		goto('/quiz');
	}
</script>

<div class="container landing">
	<header class="entrance entrance-1">
		<h1><span class="accent">namea</span>.dev</h1>
		<p class="subtitle">The quiz that determines your <em>real</em> engineering title.</p>
	</header>

	<div class="description entrance entrance-2">
		<p>Each question starts with <strong>"Name a..."</strong></p>
		<p>Get it right, you advance. Get it wrong, your role is locked forever.</p>
		<p>Questions get increasingly absurd. Good luck.</p>
	</div>

	{#if hasExistingSession}
		<div class="resume entrance entrance-3">
			<p>You have a quiz in progress.</p>
			<button class="primary" onclick={resumeQuiz}>Resume quiz</button>
			<button onclick={() => { hasExistingSession = false; }}>Start fresh</button>
		</div>
	{:else}
		<div class="start-form entrance entrance-3">
			<label for="role-select">What's your actual role?</label>
			<select id="role-select" bind:value={selectedRole}>
				<option value="" disabled>Pick your role...</option>
				{#each ACTUAL_ROLES as role}
					<option value={role}>{role}</option>
				{/each}
			</select>
			<button class="primary" onclick={start} disabled={!selectedRole}>Start quiz</button>
		</div>
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
	.subtitle {
		color: var(--text-dim);
		font-size: 1rem;
	}
	.description {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		color: var(--text);
		font-size: 0.875rem;
	}
	.description strong {
		color: var(--text-bright);
	}
	.start-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.start-form label {
		color: var(--text-dim);
		font-size: 0.875rem;
	}
	.resume {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.resume p {
		color: var(--text-dim);
		font-size: 0.875rem;
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
</style>

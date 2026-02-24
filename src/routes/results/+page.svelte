<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { quiz } from '$lib/stores/quiz';
	import { getRoleLabel } from '$lib/engine/roles';
	import { getCommentary } from '$lib/utils/commentary';
	import ResultCard from '$lib/components/ResultCard.svelte';

	let { data } = $props();

	let quizState = $state(
		{} as import('$lib/stores/quiz').QuizState
	);
	let isSharedView = $state(false);

	onMount(() => {
		quiz.init();

		// If shared link with no local state, show shared view
		if (data.shared && data.sharedData) {
			isSharedView = true;
		}

		const unsub = quiz.subscribe((s) => {
			quizState = s;
			// Only redirect if not a shared view and no local state
			if (!s.actualRole && !data.shared) {
				goto('/');
			}
		});
		submitAnalytics();
		return unsub;
	});

	async function submitAnalytics() {
		const s = quizState;
		if (!s.actualRole || s.analyticsSubmitted) return;

		const correctCount = s.answers.filter((a) => a.correct).length;
		const failedOn = s.answers.find((a) => !a.correct);

		try {
			await fetch('/api/analytics/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId: s.sessionId,
					startedAt: s.startedAt,
					actualRole: s.actualRole,
					achievedRoleId: s.achievedRoleId ?? 'none',
					correctAnswers: correctCount,
					totalQuestions: s.answers.length,
					failedOnQuestion: failedOn?.roleId ?? null
				})
			});
			quiz.markAnalyticsSubmitted();
		} catch {
			// Analytics failure is non-critical
		}
	}

	function handleRestart() {
		quiz.restart();
		goto('/');
	}

	function handleShare() {
		const s = quizState;
		const correctCount = s.answers.filter((a) => a.correct).length;
		const params = new URLSearchParams({
			r: s.achievedRoleId ?? 'none',
			a: s.actualRole,
			c: String(correctCount),
			t: String(s.answers.length)
		});
		const url = `${window.location.origin}/results?${params}`;
		navigator.clipboard.writeText(url).catch(() => {
			window.prompt('Copy this link:', url);
		});
	}
</script>

<svelte:head>
	<meta property="og:title" content={data.ogTitle} />
	<meta property="og:description" content={data.ogDescription} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.ogTitle} />
	<meta name="twitter:description" content={data.ogDescription} />
</svelte:head>

{#if isSharedView && data.sharedData && !quizState.actualRole}
	<div class="container results-page">
		<div class="shared-view">
			<h1><span class="accent">namea</span>.dev</h1>
			<div class="shared-result">
				<p class="shared-claim">Someone claims to be a <strong>{data.sharedData.actualRole}</strong></p>
				<p class="shared-achieved">
					They proved to be a
					<strong class="achieved">
						{data.sharedData.achievedRoleId === 'none'
							? 'Nothing'
							: getRoleLabel(data.sharedData.achievedRoleId)}
					</strong>
				</p>
				<p class="shared-score">{data.sharedData.correct} / {data.sharedData.total} correct</p>
			</div>
			<button class="primary" onclick={() => goto('/')}>Take the quiz yourself</button>
		</div>
	</div>
{:else if quizState.actualRole}
	<div class="container results-page">
		<div class="result-entrance">
		<ResultCard
			actualRole={quizState.actualRole}
			achievedRoleId={quizState.achievedRoleId}
			answers={quizState.answers}
			onrestart={handleRestart}
			onshare={handleShare}
		/>
		</div>
	</div>
{/if}

<style>
	.results-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.shared-view {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	h1 {
		font-size: 2rem;
		color: var(--text-bright);
	}
	.accent {
		color: var(--accent);
	}
	.shared-result {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.shared-claim {
		color: var(--text);
		font-size: 1.125rem;
	}
	.shared-achieved {
		font-size: 1.25rem;
	}
	.achieved {
		color: var(--accent);
	}
	.shared-score {
		color: var(--text-dim);
	}
	.result-entrance {
		animation: slide-up 250ms ease-out both;
	}
</style>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { quiz } from '$lib/stores/quiz';
	import { QUESTIONS } from '$lib/data/questions';
	import { computeReach, type QuestionReachStats, type ReachRow } from '$lib/utils/reach';
	import RoleDisplay from '$lib/components/RoleDisplay.svelte';
	import Feedback from '$lib/components/Feedback.svelte';

	let quizState = $state(
		{} as import('$lib/stores/quiz').QuizState
	);
	let questionStats = $state<QuestionReachStats[] | undefined>(undefined);
	let feedbackState = $state<{
		correct: boolean;
		canonical?: string;
		example?: string;
	} | null>(null);
	let inputValue = $state('');
	let inputEl: HTMLInputElement | undefined = $state();
	let flashClass = $state('');
	let shakeInput = $state(false);
	let questionKey = $state(0);

	onMount(() => {
		quiz.init();
		const unsub = quiz.subscribe((s) => {
			quizState = s;
			if (!s.actualRole) {
				goto('/');
			}
		});
		fetchReachStats();
		return unsub;
	});

	async function fetchReachStats() {
		const s = quizState;
		if (!s.actualRole) return;
		try {
			const params = new URLSearchParams({ actualRole: s.actualRole });
			const res = await fetch(`/api/analytics/stats?${params}`);
			const data = await res.json();
			if (!data.available) return;
			questionStats = computeReach(
				(data.reach ?? []) as ReachRow[],
				(data.reachFiltered ?? null) as ReachRow[] | null,
				data.total ?? 0,
				QUESTIONS.length
			);
		} catch {
			// Non-critical
		}
	}

	const currentQuestion = $derived(QUESTIONS[quizState.currentIndex]);
	const currentReach = $derived(questionStats?.[quizState.currentIndex]);
	const placeholder = $derived(
		currentQuestion?.prompt.replace(/^Name an? /i, '').replace(/\.$/, '')
	);
	const isComplete = $derived(quizState.completed || quizState.currentIndex >= QUESTIONS.length);
	const isReviewing = $derived(
		quizState.answers && quizState.currentIndex < quizState.answers.length
	);
	const reviewAnswer = $derived(
		isReviewing ? quizState.answers[quizState.currentIndex] : null
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!inputValue.trim() || feedbackState) return;

		const result = quiz.submitAnswer(inputValue);
		flashClass = result.correct ? 'flash-correct' : 'flash-wrong';

		if (result.correct) {
			// Brief flash then auto-advance
			feedbackState = { correct: true, canonical: result.canonical };
			setTimeout(() => {
				flashClass = '';
				handleContinue();
			}, 1000);
		} else {
			feedbackState = result;
			shakeInput = true;
			setTimeout(() => {
				flashClass = '';
				shakeInput = false;
			}, 400);
		}
	}

	function handleContinue() {
		quiz.advance();
		feedbackState = null;
		inputValue = '';
		questionKey++;

		const s = quizState;
		if (s.currentIndex >= QUESTIONS.length) {
			goto('/results');
			return;
		}

		// Focus input after next tick
		setTimeout(() => inputEl?.focus(), 0);
	}

	function goToResults() {
		quiz.markComplete();
		goto('/results');
	}

	function handleSkip() {
		if (feedbackState) return;
		quiz.skip();
		feedbackState = null;
		inputValue = '';
		questionKey++;

		const s = quizState;
		if (s.currentIndex >= QUESTIONS.length) {
			goto('/results');
			return;
		}

		setTimeout(() => inputEl?.focus(), 0);
	}

	function handleJump(index: number) {
		quiz.jumpTo(index);
		feedbackState = null;
		inputValue = '';
		questionKey++;
		setTimeout(() => inputEl?.focus(), 0);
	}
</script>

{#if quizState.actualRole}
	<div class="container quiz-page {flashClass}">
		<div class="quiz-header">
			<h1><span class="accent">Name a</span>...</h1>
		</div>

		{#if isComplete}
			<div class="complete">
				<p>Quiz complete!</p>
				<button class="primary" onclick={goToResults}>See results</button>
			</div>
		{:else if currentQuestion}
			<div class="question-section">
				{#if isReviewing && reviewAnswer}
					{#key questionKey}
						<div class="review question-enter" class:correct={reviewAnswer.correct} class:wrong={!reviewAnswer.correct}>
							<div class="review-status" class:correct-text={reviewAnswer.correct} class:wrong-text={!reviewAnswer.correct}>
								{reviewAnswer.correct ? '✓' : '✗'}
							</div>
							<div class="review-answer">{reviewAnswer.input}</div>
							{#if reviewAnswer.correct && reviewAnswer.canonical}
								<div class="review-canonical">{reviewAnswer.canonical}</div>
							{/if}
						</div>
					{/key}
					<div class="hint">Click a question in the progress bar to navigate</div>
				{:else if !feedbackState}
					{#key questionKey}
						<form onsubmit={handleSubmit} class="question-enter">
							<input
								type="text"
								bind:value={inputValue}
								bind:this={inputEl}
								placeholder={placeholder}
								class:shake={shakeInput}
								autofocus
							/>
						</form>
						<div class="input-footer question-enter">
							<span class="hint">Press Enter to submit</span>
							<button class="skip-btn" onclick={handleSkip}>Skip</button>
						</div>
					{/key}
				{:else}
					<Feedback
						correct={feedbackState.correct}
						canonical={feedbackState.canonical}
						example={feedbackState.example}
						roleLocked={quizState.roleLocked}
						docsUrl={currentQuestion.docsUrl}
						oncontinue={handleContinue}
						onresults={goToResults}
					/>
				{/if}
			</div>
		{/if}

		<div class="quiz-footer">
			<RoleDisplay
				achievedRoleId={quizState.achievedRoleId}
				currentIndex={quizState.currentIndex}
				answeredCount={quizState.answers?.length ?? 0}
				roleLocked={quizState.roleLocked}
				actualRole={quizState.actualRole}
				onjump={handleJump}
			/>
			{#if currentReach}
				<div class="reach-hint">
					<div class="reach-row">
						<div class="reach-track">
							<div class="reach-bar reach-bar-all" style="width: {currentReach.allPercent}%"></div>
						</div>
						<span class="reach-label">{currentReach.allPercent}% got this far</span>
					</div>
					{#if currentReach.rolePercent != null}
						<div class="reach-row">
							<div class="reach-track">
								<div class="reach-bar reach-bar-role" style="width: {currentReach.rolePercent}%"></div>
							</div>
							<span class="reach-label">{currentReach.rolePercent}% of {quizState.actualRole}s</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.quiz-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-top: 4rem;
	}
	.quiz-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
	}
	.quiz-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-bright);
		margin: 0;
	}
	.accent {
		color: var(--accent);
	}
	.quiz-footer {
		margin-top: auto;
		padding-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.question-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
		justify-content: center;
	}
	.input-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.hint {
		color: var(--text-dim);
		font-size: 0.75rem;
	}
	.skip-btn {
		background: transparent;
		border: none;
		color: var(--text-dim);
		font-size: 0.75rem;
		padding: 0.25rem 0;
		cursor: pointer;
	}
	.skip-btn:hover {
		color: var(--text);
		background: transparent;
		transform: none;
	}
	.complete {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
	.complete p {
		font-size: 1.25rem;
		color: var(--text-bright);
	}
	.review {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.5rem;
		border: 1px solid var(--border);
	}
	.review.correct {
		border-color: var(--accent);
	}
	.review.wrong {
		border-color: var(--error);
	}
	.review-status {
		font-size: 1.25rem;
		font-weight: 700;
	}
	.correct-text {
		color: var(--accent);
	}
	.wrong-text {
		color: var(--error);
	}
	.review-answer {
		color: var(--text);
	}
	.review-canonical {
		color: var(--text-dim);
		font-size: 0.875rem;
	}
	.reach-hint {
		display: flex;
		flex-direction: column;
		gap: 3px;
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
	.question-enter {
		animation: slide-up 250ms ease-out both;
	}
	.shake {
		animation: shake 300ms ease-out;
	}
</style>

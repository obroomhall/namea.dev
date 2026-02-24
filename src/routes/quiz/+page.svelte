<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { quiz } from '$lib/stores/quiz';
	import { QUESTIONS } from '$lib/data/questions';
	import RoleDisplay from '$lib/components/RoleDisplay.svelte';
	import Feedback from '$lib/components/Feedback.svelte';

	let quizState = $state(
		{} as import('$lib/stores/quiz').QuizState
	);
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
		return unsub;
	});

	const currentQuestion = $derived(QUESTIONS[quizState.currentIndex]);
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
			<span class="claimed">claimed: {quizState.actualRole}</span>
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
						<div class="hint question-enter">Press Enter to submit</div>
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
				onjump={handleJump}
			/>
		</div>
	</div>
{/if}

<style>
	.quiz-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-top: 3rem;
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
	.claimed {
		color: var(--text-dim);
		font-size: 0.75rem;
	}
	.quiz-footer {
		margin-top: auto;
		padding-bottom: 1rem;
	}
	.question-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
		justify-content: center;
	}
	.hint {
		color: var(--text-dim);
		font-size: 0.75rem;
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
	.question-enter {
		animation: slide-up 250ms ease-out both;
	}
	.shake {
		animation: shake 300ms ease-out;
	}
</style>

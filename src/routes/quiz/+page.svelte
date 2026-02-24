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
	const isComplete = $derived(quizState.completed || quizState.currentIndex >= QUESTIONS.length);

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
			}, 600);
		} else {
			feedbackState = result;
			setTimeout(() => {
				flashClass = '';
			}, 400);
		}
	}

	function handleContinue() {
		quiz.advance();
		feedbackState = null;
		inputValue = '';

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
		setTimeout(() => inputEl?.focus(), 0);
	}
</script>

{#if quizState.actualRole}
	<div class="container quiz-page {flashClass}">
		<div class="quiz-header">
			<span class="claimed">claimed: {quizState.actualRole}</span>
			<RoleDisplay
				achievedRoleId={quizState.achievedRoleId}
				currentIndex={quizState.currentIndex}
				roleLocked={quizState.roleLocked}
				onjump={handleJump}
			/>
		</div>

		{#if isComplete}
			<div class="complete">
				<p>Quiz complete!</p>
				<button class="primary" onclick={goToResults}>See results</button>
			</div>
		{:else if currentQuestion}
			<div class="question-section">
				<div class="counter">{quizState.currentIndex + 1} / {QUESTIONS.length}</div>
				<h2 class="prompt">{currentQuestion.prompt}</h2>

				{#if !feedbackState}
					<form onsubmit={handleSubmit}>
						<input
							type="text"
							bind:value={inputValue}
							bind:this={inputEl}
							placeholder="Type your answer..."
							autofocus
						/>
					</form>
					<div class="hint">Press Enter to submit</div>
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
		flex-direction: column;
		gap: 0.25rem;
	}
	.claimed {
		color: var(--text-dim);
		font-size: 0.75rem;
	}
	.question-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
		justify-content: center;
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
</style>

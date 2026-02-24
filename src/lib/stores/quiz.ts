import { writable, get } from 'svelte/store';
import { ROLES } from '$lib/engine/roles';
import { QUESTIONS } from '$lib/data/questions';
import { checkAnswer, getExampleAnswer } from '$lib/engine/matcher';
import { loadState, saveState, clearState } from '$lib/utils/persistence';

export interface AnswerRecord {
	roleId: string;
	input: string;
	correct: boolean;
	canonical?: string;
}

export interface QuizState {
	sessionId: string;
	actualRole: string;
	currentIndex: number;
	answers: AnswerRecord[];
	achievedRoleId: string | null;
	roleLocked: boolean;
	startedAt: string;
	completed: boolean;
	analyticsSubmitted: boolean;
}

function generateSessionId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createInitialState(): QuizState {
	return {
		sessionId: generateSessionId(),
		actualRole: '',
		currentIndex: 0,
		answers: [],
		achievedRoleId: null,
		roleLocked: false,
		startedAt: new Date().toISOString(),
		completed: false,
		analyticsSubmitted: false
	};
}

function createQuizStore() {
	const state = writable<QuizState>(createInitialState());

	function persist() {
		saveState(get(state));
	}

	return {
		subscribe: state.subscribe,

		init() {
			const saved = loadState<QuizState | null>(null);
			if (saved && saved.sessionId && saved.actualRole) {
				state.set(saved);
			}
		},

		start(actualRole: string) {
			state.update((s) => ({
				...s,
				actualRole,
				currentIndex: 0,
				answers: [],
				achievedRoleId: null,
				roleLocked: false,
				startedAt: new Date().toISOString(),
				completed: false,
				analyticsSubmitted: false,
				sessionId: generateSessionId()
			}));
			persist();
		},

		submitAnswer(input: string): { correct: boolean; canonical?: string; example?: string } {
			const s = get(state);
			const question = QUESTIONS[s.currentIndex];
			if (!question) return { correct: false };

			const result = checkAnswer(question, input);
			const record: AnswerRecord = {
				roleId: question.roleId,
				input,
				correct: result.correct,
				canonical: result.canonical
			};

			state.update((s) => {
				const newAnswers = [...s.answers, record];
				let achievedRoleId = s.achievedRoleId;
				let roleLocked = s.roleLocked;

				if (result.correct && !s.roleLocked) {
					achievedRoleId = question.roleId;
				} else if (!result.correct && !s.roleLocked) {
					roleLocked = true;
				}

				return { ...s, answers: newAnswers, achievedRoleId, roleLocked };
			});
			persist();

			if (result.correct) {
				return { correct: true, canonical: result.canonical };
			} else {
				return { correct: false, example: getExampleAnswer(question) };
			}
		},

		advance() {
			state.update((s) => {
				const nextIndex = s.currentIndex + 1;
				const completed = nextIndex >= QUESTIONS.length;
				return { ...s, currentIndex: nextIndex, completed };
			});
			persist();
		},

		markComplete() {
			state.update((s) => ({ ...s, completed: true }));
			persist();
		},

		markAnalyticsSubmitted() {
			state.update((s) => ({ ...s, analyticsSubmitted: true }));
			persist();
		},

		restart() {
			clearState();
			state.set(createInitialState());
		},

		get currentQuestion() {
			const s = get(state);
			return QUESTIONS[s.currentIndex] ?? null;
		},

		get totalQuestions() {
			return QUESTIONS.length;
		},

		get currentRole() {
			const s = get(state);
			return ROLES.find((r) => r.id === s.achievedRoleId) ?? null;
		}
	};
}

export const quiz = createQuizStore();

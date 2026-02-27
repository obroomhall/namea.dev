import type { Question } from '$lib/data/questions';

export interface MatchResult {
	correct: boolean;
	canonical?: string;
}

function normalize(input: string): string {
	return input.trim().toLowerCase();
}

function sortedWords(s: string): string {
	return normalize(s).split(/\s+/).sort().join(' ');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(input: string): boolean {
	return UUID_RE.test(input.trim());
}

function isValidBrainfuckWithOutput(input: string): boolean {
	const program = input.trim();
	if (!program) return false;
	// Only allow valid brainfuck characters
	const valid = /^[><+\-.,[\]]+$/;
	if (!valid.test(program)) return false;
	// Must contain at least one '.' (output instruction)
	if (!program.includes('.')) return false;
	// Check balanced brackets
	let depth = 0;
	for (const ch of program) {
		if (ch === '[') depth++;
		if (ch === ']') depth--;
		if (depth < 0) return false;
	}
	return depth === 0;
}

type ValidatorFn = (input: string) => MatchResult;

const VALIDATORS: Record<string, ValidatorFn> = {
	uuid: (input: string) => {
		if (isValidUuid(input)) {
			return { correct: true, canonical: input.trim().toLowerCase() };
		}
		return { correct: false };
	},
	brainfuck: (input: string) => {
		if (isValidBrainfuckWithOutput(input)) {
			return { correct: true, canonical: input.trim() };
		}
		return { correct: false };
	}
};

export function checkAnswer(question: Question, input: string): MatchResult {
	const trimmed = input.trim();
	if (!trimmed) return { correct: false };

	// Custom validator (e.g. uuid, brainfuck)
	if (question.validator) {
		const validate = VALIDATORS[question.validator];
		if (validate) {
			return validate(trimmed);
		}
	}

	// Standard accept-list matching
	const normalized = normalize(trimmed);
	const inputWords = sortedWords(trimmed);
	for (const answer of question.answers) {
		if (
			answer.accept.some(
				(a) => normalize(a) === normalized || (inputWords.includes(' ') && sortedWords(a) === inputWords)
			)
		) {
			return { correct: true, canonical: answer.canonical };
		}
	}

	return { correct: false };
}

export function getExampleAnswer(question: Question): string {
	if (question.exampleAnswer) return question.exampleAnswer;
	return question.answers[0].canonical;
}

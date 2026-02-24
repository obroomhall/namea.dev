import type { Question } from '$lib/data/questions';

export interface MatchResult {
	correct: boolean;
	canonical?: string;
}

function normalize(input: string): string {
	return input.trim().toLowerCase();
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

export function checkAnswer(question: Question, input: string): MatchResult {
	const trimmed = input.trim();
	if (!trimmed) return { correct: false };

	// Special question: UUID
	if (question.roleId === 'cpu') {
		if (isValidUuid(trimmed)) {
			return { correct: true, canonical: trimmed.toLowerCase() };
		}
		return { correct: false };
	}

	// Special question: brainfuck
	if (question.roleId === 'dev-null') {
		if (isValidBrainfuckWithOutput(trimmed)) {
			return { correct: true, canonical: trimmed };
		}
		return { correct: false };
	}

	// Standard accept-list matching
	const normalized = normalize(trimmed);
	for (const answer of question.answers) {
		if (answer.accept.some((a) => normalize(a) === normalized)) {
			return { correct: true, canonical: answer.canonical };
		}
	}

	return { correct: false };
}

export function getExampleAnswer(question: Question): string {
	if (question.roleId === 'cpu') return '550e8400-e29b-41d4-a716-446655440000';
	if (question.roleId === 'dev-null') return '++++++[>+++++++++<-]>.';
	return question.answers[0].canonical;
}

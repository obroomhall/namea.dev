import { describe, it, expect } from 'vitest';
import { checkAnswer, getExampleAnswer } from './matcher';
import { QUESTIONS } from '$lib/data/questions';

function q(roleId: string) {
	const question = QUESTIONS.find((q) => q.roleId === roleId);
	if (!question) throw new Error(`No question for role: ${roleId}`);
	return question;
}

describe('checkAnswer', () => {
	describe('standard questions', () => {
		it('accepts exact match', () => {
			const result = checkAnswer(q('student'), 'javascript');
			expect(result.correct).toBe(true);
			expect(result.canonical).toBe('JavaScript');
		});

		it('is case-insensitive', () => {
			expect(checkAnswer(q('student'), 'PYTHON').correct).toBe(true);
			expect(checkAnswer(q('student'), 'PyThOn').correct).toBe(true);
		});

		it('trims whitespace', () => {
			expect(checkAnswer(q('student'), '  rust  ').correct).toBe(true);
		});

		it('rejects empty input', () => {
			expect(checkAnswer(q('student'), '').correct).toBe(false);
			expect(checkAnswer(q('student'), '   ').correct).toBe(false);
		});

		it('rejects wrong answers', () => {
			expect(checkAnswer(q('student'), 'html').correct).toBe(false);
			expect(checkAnswer(q('student'), 'css').correct).toBe(false);
			expect(checkAnswer(q('student'), 'gibberish').correct).toBe(false);
		});

		it('accepts alternate forms', () => {
			expect(checkAnswer(q('student'), 'js').correct).toBe(true);
			expect(checkAnswer(q('student'), 'cpp').correct).toBe(true);
			expect(checkAnswer(q('student'), 'golang').correct).toBe(true);
		});
	});

	describe('HTTP status codes', () => {
		it('accepts number only', () => {
			const result = checkAnswer(q('intern'), '404');
			expect(result.correct).toBe(true);
			expect(result.canonical).toBe('404 Not Found');
		});

		it('accepts full status text', () => {
			expect(checkAnswer(q('intern'), '200 ok').correct).toBe(true);
		});

		it('accepts the teapot', () => {
			expect(checkAnswer(q('intern'), '418').correct).toBe(true);
		});
	});

	describe('JS primitive types', () => {
		it('accepts all seven primitives', () => {
			for (const type of ['string', 'number', 'boolean', 'undefined', 'null', 'bigint', 'symbol']) {
				expect(checkAnswer(q('junior'), type).correct).toBe(true);
			}
		});

		it('rejects non-primitives', () => {
			expect(checkAnswer(q('junior'), 'object').correct).toBe(false);
			expect(checkAnswer(q('junior'), 'array').correct).toBe(false);
			expect(checkAnswer(q('junior'), 'function').correct).toBe(false);
		});
	});

	describe('UUID question', () => {
		it('accepts a valid v4 UUID', () => {
			const result = checkAnswer(q('cpu'), '550e8400-e29b-41d4-a716-446655440000');
			expect(result.correct).toBe(true);
		});

		it('accepts a UUID with uppercase', () => {
			expect(checkAnswer(q('cpu'), 'A0B1C2D3-E4F5-6789-ABCD-EF0123456789').correct).toBe(true);
		});

		it('rejects invalid format', () => {
			expect(checkAnswer(q('cpu'), 'not-a-uuid').correct).toBe(false);
			expect(checkAnswer(q('cpu'), '550e8400e29b41d4a716446655440000').correct).toBe(false);
			expect(checkAnswer(q('cpu'), '').correct).toBe(false);
		});
	});

	describe('brainfuck question', () => {
		it('accepts a simple output program', () => {
			const result = checkAnswer(q('dev-null'), '++++++[>+++++++++<-]>.');
			expect(result.correct).toBe(true);
		});

		it('accepts minimal output', () => {
			expect(checkAnswer(q('dev-null'), '.').correct).toBe(true);
		});

		it('rejects program without output', () => {
			expect(checkAnswer(q('dev-null'), '+++').correct).toBe(false);
		});

		it('rejects unbalanced brackets', () => {
			expect(checkAnswer(q('dev-null'), '[.').correct).toBe(false);
			expect(checkAnswer(q('dev-null'), '.]').correct).toBe(false);
		});

		it('rejects invalid characters', () => {
			expect(checkAnswer(q('dev-null'), 'hello.world').correct).toBe(false);
		});
	});
});

describe('getExampleAnswer', () => {
	it('returns first canonical for standard questions', () => {
		expect(getExampleAnswer(q('student'))).toBe('JavaScript');
		expect(getExampleAnswer(q('intern'))).toBe('100 Continue');
	});

	it('returns example UUID for cpu question', () => {
		expect(getExampleAnswer(q('cpu'))).toContain('-');
	});

	it('returns example brainfuck for dev-null question', () => {
		expect(getExampleAnswer(q('dev-null'))).toContain('.');
	});
});

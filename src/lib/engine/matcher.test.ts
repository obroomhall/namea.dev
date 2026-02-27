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

		it('accepts words in any order', () => {
			expect(checkAnswer(q('intern'), 'not found 404').correct).toBe(true);
			expect(checkAnswer(q('intern'), 'bad request 400').correct).toBe(true);
		});

		it('accepts text-only status names', () => {
			expect(checkAnswer(q('intern'), 'not found').correct).toBe(true);
			expect(checkAnswer(q('intern'), 'internal server error').correct).toBe(true);
		});
	});

	describe('sorting algorithms', () => {
		it('accepts short form', () => {
			expect(checkAnswer(q('principal'), 'bubble').correct).toBe(true);
			expect(checkAnswer(q('principal'), 'merge').correct).toBe(true);
			expect(checkAnswer(q('principal'), 'quick').correct).toBe(true);
		});

		it('still accepts full name', () => {
			const result = checkAnswer(q('principal'), 'bubble sort');
			expect(result.correct).toBe(true);
			expect(result.canonical).toBe('Bubble Sort');
		});
	});

	describe('ASCII characters', () => {
		it('accepts code with character name', () => {
			expect(checkAnswer(q('cto'), '42 asterisk').correct).toBe(true);
			expect(checkAnswer(q('cto'), '64 at').correct).toBe(true);
		});

		it('accepts code with symbol', () => {
			expect(checkAnswer(q('cto'), '33 !').correct).toBe(true);
			expect(checkAnswer(q('cto'), '35 #').correct).toBe(true);
		});

		it('accepts code only for printable characters', () => {
			expect(checkAnswer(q('cto'), '65').correct).toBe(true);
			expect(checkAnswer(q('cto'), '95').correct).toBe(true);
		});
	});

	describe('UUID question', () => {
		it('accepts a valid v4 UUID', () => {
			const result = checkAnswer(q('linus'), '550e8400-e29b-41d4-a716-446655440000');
			expect(result.correct).toBe(true);
		});

		it('accepts a UUID with uppercase', () => {
			expect(checkAnswer(q('linus'), 'A0B1C2D3-E4F5-6789-ABCD-EF0123456789').correct).toBe(true);
		});

		it('rejects invalid format', () => {
			expect(checkAnswer(q('linus'), 'not-a-uuid').correct).toBe(false);
			expect(checkAnswer(q('linus'), '550e8400e29b41d4a716446655440000').correct).toBe(false);
			expect(checkAnswer(q('linus'), '').correct).toBe(false);
		});
	});

	describe('brainfuck question', () => {
		it('accepts a simple output program', () => {
			const result = checkAnswer(q('the-entity'), '++++++[>+++++++++<-]>.');
			expect(result.correct).toBe(true);
		});

		it('accepts minimal output', () => {
			expect(checkAnswer(q('the-entity'), '.').correct).toBe(true);
		});

		it('rejects program without output', () => {
			expect(checkAnswer(q('the-entity'), '+++').correct).toBe(false);
		});

		it('rejects unbalanced brackets', () => {
			expect(checkAnswer(q('the-entity'), '[.').correct).toBe(false);
			expect(checkAnswer(q('the-entity'), '.]').correct).toBe(false);
		});

		it('rejects invalid characters', () => {
			expect(checkAnswer(q('the-entity'), 'hello.world').correct).toBe(false);
		});
	});
});

describe('getExampleAnswer', () => {
	it('returns first canonical for standard questions', () => {
		expect(getExampleAnswer(q('student'))).toBe('JavaScript');
		expect(getExampleAnswer(q('intern'))).toBe('100 Continue');
	});

	it('returns example UUID for linus question', () => {
		expect(getExampleAnswer(q('linus'))).toContain('-');
	});

	it('returns example brainfuck for the-entity question', () => {
		expect(getExampleAnswer(q('the-entity'))).toContain('.');
	});
});

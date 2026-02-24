import { describe, it, expect } from 'vitest';
import { computeReach } from './reach';

describe('computeReach', () => {
	it('returns zero percentages for empty data', () => {
		const result = computeReach([], null, 0, 3);
		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({ allPercent: 0, rolePercent: null, allCount: 0, roleCount: null });
		expect(result[2]).toEqual({ allPercent: 0, rolePercent: null, allCount: 0, roleCount: null });
	});

	it('handles a single completion that answered all questions', () => {
		const rawAll = [{ total_questions: 3, count: 1 }];
		const result = computeReach(rawAll, null, 1, 3);
		expect(result[0]).toEqual({ allPercent: 100, rolePercent: null, allCount: 1, roleCount: null });
		expect(result[1]).toEqual({ allPercent: 100, rolePercent: null, allCount: 1, roleCount: null });
		expect(result[2]).toEqual({ allPercent: 100, rolePercent: null, allCount: 1, roleCount: null });
	});

	it('computes cumulative reach for multiple completions', () => {
		// 5 people total:
		// 2 answered 1 question, 1 answered 2, 2 answered 3
		const rawAll = [
			{ total_questions: 1, count: 2 },
			{ total_questions: 2, count: 1 },
			{ total_questions: 3, count: 2 }
		];
		const result = computeReach(rawAll, null, 5, 3);

		// Q1: all 5 reached it (>= 1)
		expect(result[0].allPercent).toBe(100);
		expect(result[0].allCount).toBe(5);

		// Q2: 3 reached it (>= 2): 1 + 2
		expect(result[1].allPercent).toBe(60);
		expect(result[1].allCount).toBe(3);

		// Q3: 2 reached it (>= 3)
		expect(result[2].allPercent).toBe(40);
		expect(result[2].allCount).toBe(2);
	});

	it('computes role-filtered reach alongside overall', () => {
		const rawAll = [
			{ total_questions: 1, count: 3 },
			{ total_questions: 2, count: 2 },
			{ total_questions: 3, count: 5 }
		];
		const rawRole = [
			{ total_questions: 1, count: 1 },
			{ total_questions: 3, count: 2 }
		];

		const result = computeReach(rawAll, rawRole, 10, 3);

		// Overall: Q1=10, Q2=7, Q3=5
		expect(result[0].allPercent).toBe(100);
		expect(result[1].allPercent).toBe(70);
		expect(result[2].allPercent).toBe(50);

		// Role (total 3): Q1=3, Q2=2, Q3=2
		expect(result[0].rolePercent).toBe(100);
		expect(result[0].roleCount).toBe(3);
		expect(result[1].rolePercent).toBe(67);
		expect(result[1].roleCount).toBe(2);
		expect(result[2].rolePercent).toBe(67);
		expect(result[2].roleCount).toBe(2);
	});

	it('returns null role stats when rawRole is null', () => {
		const rawAll = [{ total_questions: 2, count: 4 }];
		const result = computeReach(rawAll, null, 4, 2);

		expect(result[0].rolePercent).toBeNull();
		expect(result[0].roleCount).toBeNull();
	});

	it('returns null role stats when rawRole is empty', () => {
		const rawAll = [{ total_questions: 1, count: 1 }];
		const result = computeReach(rawAll, [], 1, 1);

		expect(result[0].rolePercent).toBeNull();
		expect(result[0].roleCount).toBeNull();
	});
});

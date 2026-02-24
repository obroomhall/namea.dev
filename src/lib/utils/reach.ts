export interface ReachRow {
	total_questions: number;
	count: number;
}

export interface QuestionReachStats {
	allPercent: number;
	rolePercent: number | null;
	allCount: number;
	roleCount: number | null;
}

/**
 * Converts raw {total_questions, count}[] distributions into per-question
 * cumulative reach percentages. "Reached question i" means total_questions >= i + 1.
 */
export function computeReach(
	rawAll: ReachRow[],
	rawRole: ReachRow[] | null,
	totalAll: number,
	questionCount: number
): QuestionReachStats[] {
	if (totalAll === 0) {
		return Array.from({ length: questionCount }, () => ({
			allPercent: 0,
			rolePercent: null,
			allCount: 0,
			roleCount: null
		}));
	}

	const totalRole = rawRole ? rawRole.reduce((sum, r) => sum + r.count, 0) : 0;

	const result: QuestionReachStats[] = [];

	for (let i = 0; i < questionCount; i++) {
		const minQuestions = i + 1;

		const allCount = rawAll
			.filter((r) => r.total_questions >= minQuestions)
			.reduce((sum, r) => sum + r.count, 0);

		let roleCount: number | null = null;
		let rolePercent: number | null = null;

		if (rawRole && totalRole > 0) {
			roleCount = rawRole
				.filter((r) => r.total_questions >= minQuestions)
				.reduce((sum, r) => sum + r.count, 0);
			rolePercent = Math.round((roleCount / totalRole) * 100);
		}

		result.push({
			allPercent: Math.round((allCount / totalAll) * 100),
			rolePercent,
			allCount,
			roleCount
		});
	}

	return result;
}

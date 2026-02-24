import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ available: false });
	}

	try {
		const actualRole = url.searchParams.get('actualRole');

		// Overall distribution of achieved roles
		const overall = await db
			.prepare(
				`SELECT achieved_role_id, COUNT(*) as count
				FROM quiz_completions
				GROUP BY achieved_role_id
				ORDER BY count DESC`
			)
			.all();

		// Total completions
		const totalResult = await db
			.prepare(`SELECT COUNT(*) as total FROM quiz_completions`)
			.first<{ total: number }>();

		let filtered = null;
		if (actualRole) {
			filtered = await db
				.prepare(
					`SELECT achieved_role_id, COUNT(*) as count
					FROM quiz_completions
					WHERE actual_role = ?
					GROUP BY achieved_role_id
					ORDER BY count DESC`
				)
				.bind(actualRole)
				.all();
		}

		// Per-question reach: how many people got at least N correct
		const reach = await db
			.prepare(
				`SELECT correct_answers as total_questions, COUNT(*) as count
				FROM quiz_completions
				GROUP BY correct_answers`
			)
			.all();

		let reachFiltered = null;
		if (actualRole) {
			reachFiltered = await db
				.prepare(
					`SELECT correct_answers as total_questions, COUNT(*) as count
					FROM quiz_completions
					WHERE actual_role = ?
					GROUP BY correct_answers`
				)
				.bind(actualRole)
				.all();
		}

		return json({
			available: true,
			total: totalResult?.total ?? 0,
			overall: overall.results,
			filtered: filtered?.results ?? null,
			reach: reach.results,
			reachFiltered: reachFiltered?.results ?? null
		});
	} catch (e) {
		console.error('Analytics stats error:', e);
		return json({ available: false });
	}
};

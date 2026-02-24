import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ ok: true, stored: false });
	}

	try {
		const body = await request.json();
		const {
			sessionId,
			startedAt,
			actualRole,
			achievedRoleId,
			correctAnswers,
			totalQuestions,
			failedOnQuestion
		} = body;

		if (!sessionId || !actualRole || !achievedRoleId) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		await db
			.prepare(
				`INSERT OR IGNORE INTO quiz_completions
				(session_id, started_at, actual_role, achieved_role_id, correct_answers, total_questions, failed_on_question)
				VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				sessionId,
				startedAt || new Date().toISOString(),
				actualRole,
				achievedRoleId,
				correctAnswers ?? 0,
				totalQuestions ?? 0,
				failedOnQuestion ?? null
			)
			.run();

		return json({ ok: true, stored: true });
	} catch (e) {
		console.error('Analytics submit error:', e);
		return json({ ok: true, stored: false });
	}
};

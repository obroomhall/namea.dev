import type { PageServerLoad } from './$types';
import { getRoleLabel } from '$lib/engine/roles';
import { config } from '$lib/data/config';

export const load: PageServerLoad = async ({ url }) => {
	const achievedRoleId = url.searchParams.get('r');
	const actualRole = url.searchParams.get('a');
	const correct = url.searchParams.get('c');
	const total = url.searchParams.get('t');
	const title = config.branding.title;

	// If no URL params, this is a direct visit — OG tags will be generic
	if (!achievedRoleId || !actualRole) {
		return {
			ogTitle: `${title} — Quiz Results`,
			ogDescription: config.branding.description,
			shared: false
		};
	}

	const achievedLabel = achievedRoleId === 'none' ? 'Nothing' : getRoleLabel(achievedRoleId);
	const scoreText = correct && total ? `${correct}/${total} correct` : '';

	let description: string;
	if (achievedRoleId === 'none') {
		description = `Claims to be a ${actualRole} but couldn't even pass the first question.`;
	} else if (achievedLabel === actualRole) {
		description = `Claims to be a ${actualRole} and actually proved it. ${scoreText}`;
	} else {
		description = `Claims to be a ${actualRole} but proved to be a ${achievedLabel}. ${scoreText}`;
	}

	return {
		ogTitle: `${title} — ${achievedLabel}`,
		ogDescription: description,
		shared: true,
		sharedData: {
			achievedRoleId,
			actualRole,
			correct: correct ? parseInt(correct) : 0,
			total: total ? parseInt(total) : 0
		}
	};
};

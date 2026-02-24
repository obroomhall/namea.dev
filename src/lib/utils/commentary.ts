import { ROLES } from '$lib/engine/roles';

function roleIndex(roleId: string | null): number {
	if (!roleId) return -1;
	return ROLES.findIndex((r) => r.id === roleId);
}

function actualRoleToId(actualRole: string): string | undefined {
	const map: Record<string, string> = {
		'Student': 'student',
		'Intern': 'intern',
		'Junior Engineer': 'junior',
		'Mid-Level Engineer': 'mid',
		'Senior Engineer': 'senior',
		'Staff Engineer': 'staff',
		'Principal Engineer': 'principal',
		'Engineering Manager': 'principal',
		'Director of Engineering': 'principal',
		'VP of Engineering': 'principal',
		'CTO': 'principal'
	};
	return map[actualRole];
}

export function getCommentary(
	actualRole: string,
	achievedRoleId: string | null,
	correct: number,
	total: number
): string {
	const achievedIdx = roleIndex(achievedRoleId);
	const actualId = actualRoleToId(actualRole);
	const actualIdx = actualId ? roleIndex(actualId) : -1;

	if (correct === total) {
		return "Perfect score. You are either a genius or suspiciously good at Googling.";
	}

	if (correct === 0) {
		return "Zero correct. Genuinely impressive in its own way. Have you tried turning your career off and on again?";
	}

	if (!achievedRoleId) {
		return "You failed the very first question. Even the Student role rejected you.";
	}

	if (achievedIdx > actualIdx && actualIdx >= 0) {
		const diff = achievedIdx - actualIdx;
		if (diff >= 3) {
			return `You're severely underselling yourself. Quit your job and demand the title you deserve.`;
		}
		return `Not bad — you outperformed your claimed role. Imposter syndrome, perhaps?`;
	}

	if (achievedIdx === actualIdx) {
		return "You are exactly who you say you are. How boring. How accurate.";
	}

	if (achievedIdx < actualIdx && actualIdx >= 0) {
		const diff = actualIdx - achievedIdx;
		if (diff >= 3) {
			return `You claim to be a ${actualRole} but proved otherwise. Does your manager know?`;
		}
		return `Close, but your title might be slightly aspirational.`;
	}

	// Absurd roles achieved
	if (achievedIdx >= 7) {
		return "You've transcended engineering entirely. You are now a force of nature.";
	}

	return `${correct} out of ${total}. The universe has noted your performance.`;
}

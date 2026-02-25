import { config } from '$lib/data/config';
import { ROLES } from '$lib/engine/roles';

function roleIndex(roleId: string | null): number {
	if (!roleId) return -1;
	return ROLES.findIndex((r) => r.id === roleId);
}

function actualRoleToId(actualRole: string): string | undefined {
	// Build mapping from non-absurd role labels to their IDs
	const role = ROLES.find((r) => !r.absurd && r.label === actualRole);
	return role?.id;
}

function interpolate(template: string, vars: Record<string, string>): string {
	return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

export function getCommentary(
	actualRole: string,
	achievedRoleId: string | null,
	correct: number,
	total: number
): string {
	const c = config.commentary;
	const achievedIdx = roleIndex(achievedRoleId);
	const actualId = actualRoleToId(actualRole);
	const actualIdx = actualId ? roleIndex(actualId) : -1;
	const firstRole = ROLES[0]?.label ?? '';
	const vars = { actualRole, firstRole, correct: String(correct), total: String(total) };

	if (correct === total) {
		return interpolate(c.perfect, vars);
	}

	if (correct === 0) {
		return interpolate(c.zero, vars);
	}

	if (!achievedRoleId) {
		return interpolate(c.noRole, vars);
	}

	if (achievedIdx > actualIdx && actualIdx >= 0) {
		const diff = achievedIdx - actualIdx;
		if (diff >= 3) {
			return interpolate(c.overAchievedFar, vars);
		}
		return interpolate(c.overAchievedClose, vars);
	}

	if (achievedIdx === actualIdx) {
		return interpolate(c.exact, vars);
	}

	if (achievedIdx < actualIdx && actualIdx >= 0) {
		const diff = actualIdx - achievedIdx;
		if (diff >= 3) {
			return interpolate(c.underAchievedFar, vars);
		}
		return interpolate(c.underAchievedClose, vars);
	}

	// Absurd roles achieved
	const absurdStartIdx = ROLES.findIndex((r) => r.absurd);
	if (absurdStartIdx >= 0 && achievedIdx >= absurdStartIdx) {
		return interpolate(c.absurd, vars);
	}

	return interpolate(c.fallback, vars);
}

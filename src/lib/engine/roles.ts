import { config } from '$lib/data/config';
import type { Role } from '$lib/data/config';

export type { Role };

export const ROLES: Role[] = config.roles;

export const ACTUAL_ROLES: string[] = config.actualRoles;

export function getRoleById(id: string): Role | undefined {
	return ROLES.find((r) => r.id === id);
}

export function getRoleLabel(id: string): string {
	return getRoleById(id)?.label ?? id;
}

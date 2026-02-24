export interface Role {
	id: string;
	label: string;
	absurd?: boolean;
}

export const ROLES: Role[] = [
	{ id: 'student', label: 'Student' },
	{ id: 'intern', label: 'Intern' },
	{ id: 'junior', label: 'Junior Engineer' },
	{ id: 'mid', label: 'Mid-Level Engineer' },
	{ id: 'senior', label: 'Senior Engineer' },
	{ id: 'staff', label: 'Staff Engineer' },
	{ id: 'principal', label: 'Principal Engineer' },
	{ id: 'mass', label: 'Mass', absurd: true },
	{ id: 'gravitational-constant', label: 'Gravitational Constant', absurd: true },
	{ id: 'cpu', label: 'CPU', absurd: true },
	{ id: 'dev-null', label: '/dev/null', absurd: true }
];

export const ACTUAL_ROLES = [
	'Student',
	'Intern',
	'Junior Engineer',
	'Mid-Level Engineer',
	'Senior Engineer',
	'Staff Engineer',
	'Principal Engineer'
];

export function getRoleById(id: string): Role | undefined {
	return ROLES.find((r) => r.id === id);
}

export function getRoleLabel(id: string): string {
	return getRoleById(id)?.label ?? id;
}

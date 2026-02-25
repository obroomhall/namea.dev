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
	{ id: 'senior-staff', label: 'Senior Staff Engineer', absurd: true },
	{ id: 'senior-principal', label: 'Senior Principal Engineer', absurd: true },
	{ id: 'principal-staff', label: 'Principal Staff Engineer', absurd: true },
	{ id: 'staff-principal', label: 'Staff Principal Engineer', absurd: true },
	{ id: 'senior-senior', label: 'Senior Senior Engineer', absurd: true },
	{ id: 'principal-principal', label: 'Principal Principal Engineer', absurd: true },
	{ id: 'principally-senior', label: 'Principally Senior Engineer', absurd: true },
	{ id: 'seniorly-principal', label: 'Seniorly Principal Engineer', absurd: true },
	{ id: 'cto', label: 'CTO', absurd: true },
	{ id: 'ceo', label: 'CEO', absurd: true },
	{ id: '10x', label: '10x Engineer', absurd: true },
	{ id: 'linus', label: 'Linus Torvalds', absurd: true },
	{ id: 'the-entity', label: 'The Entity', absurd: true }
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

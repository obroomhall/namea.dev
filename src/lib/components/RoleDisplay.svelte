<script lang="ts">
	import { getRoleLabel } from '$lib/engine/roles';

	let { roleId, locked = false }: { roleId: string | null; locked?: boolean } = $props();
</script>

<div class="role-display">
	<span class="label">Current role:</span>
	<span class="role" class:locked>
		{roleId ? getRoleLabel(roleId) : 'None'}
	</span>
	{#if locked}
		<span class="lock">locked</span>
	{/if}
</div>

<style>
	.role-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	.label {
		color: var(--text-dim);
	}
	.role {
		color: var(--accent);
		font-weight: 600;
	}
	.role.locked {
		color: var(--error);
	}
	.lock {
		color: var(--text-dim);
		font-size: 0.75rem;
		border: 1px solid var(--border);
		padding: 0.1rem 0.3rem;
	}
</style>

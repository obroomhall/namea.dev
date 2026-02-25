<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { config } from '$lib/data/config';

	let { children } = $props();
</script>

<svelte:head>
	<title>{config.branding.title}</title>
	<meta name="description" content={config.branding.description} />
</svelte:head>

{#key page.url.pathname}
	<div in:fade={{ duration: 150 }}>
		{@render children()}
	</div>
{/key}

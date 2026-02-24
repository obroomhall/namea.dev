<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head>
	<title>namea.dev</title>
	<meta name="description" content="Name a... quiz for software developers" />
</svelte:head>

{#key page.url.pathname}
	<div in:fade={{ duration: 150 }}>
		{@render children()}
	</div>
{/key}

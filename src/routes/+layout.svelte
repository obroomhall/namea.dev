<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>namea.dev</title>
	<meta name="description" content="Name a... quiz for software developers" />
</svelte:head>

{@render children()}

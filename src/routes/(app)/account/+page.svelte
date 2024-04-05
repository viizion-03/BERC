<script>
	import MyToast from '$lib/components/MyToast.svelte'
	export let data;

	const { user } = data;
</script>
<MyToast />
<ul>
	<li>
		<strong>Email:</strong>
		{user.email}
	</li>
	<li>
		<strong>Name:</strong>
		{user.name}
	</li>
	<li>
		<strong>ID: </strong>
		{user.$id}
	</li>
</ul>

<form method="post" action='?/logout'>
	<button type="submit">Log out</button>
</form>

<form action="?/test" method="post">
<button type="submit">PUSH ME TO TEST FLASH</button>
</form>

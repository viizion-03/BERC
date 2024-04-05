 <script>
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message';
	import toast, { Toaster } from 'svelte-french-toast';

	const flash = getFlash(page);

	$: {
		if ($flash) {
			switch ($flash.type) {
				case 'success':
					toast.success($flash.message);
					break;
				case 'error':
					toast.error($flash.message);
					break;
			}
		}
	}
</script>

<Toaster />
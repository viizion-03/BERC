import { UserProfileService } from '$lib/services/backend-services.js';
import { redirect } from '@sveltejs/kit';
// @ts-ignore

// @ts-ignore
export async function load({ locals, url }) {
	// @ts-ignore
	if (!locals.user) {
		if (!url.pathname.startsWith('/auth')) redirect(301, '/auth/login');
	} else {
		if (url.pathname.startsWith('/auth')) redirect(301, '/');
	}

	return {};
}

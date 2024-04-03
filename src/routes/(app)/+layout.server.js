import { UserProfileService } from '$lib/services/backend-services.js';
import { redirect } from '@sveltejs/kit';
import { loadFlash } from 'sveltekit-flash-message/server';
// @ts-ignore
import { Query } from 'appwrite';

// @ts-ignore
export const load = async ({ locals, url }) => {

	// @ts-ignore
	if (!locals.user) {
		redirect(301, '/auth/login');
	} else {
		if (url.pathname.startsWith('/auth')) {
			redirect(301, '/');
		}
	}

	// @ts-ignore
	const profileData = await new UserProfileService().get(locals.user.$id).then((res) => {
		if ('doc' in res) return res.doc;
	});

	// @ts-ignore
	return { user: { ...locals.user, ...profileData } };
};

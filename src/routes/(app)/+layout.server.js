import { UserProfileService } from '$lib/services/backend-services.js';
import { redirect } from '@sveltejs/kit';
// @ts-ignore
import { Query } from 'appwrite';

// @ts-ignore
export async function load({ locals }) {
	// @ts-ignore
	if (!locals.user) {
		redirect(301, '/auth/login');
	}

	// @ts-ignore
	const profileData = await new UserProfileService().get(locals.user.$id).then((res) => {
		if ('doc' in res) return res.doc;
	});

    

	// @ts-ignore
	return { user: {...locals.user, ...profileData} };
}

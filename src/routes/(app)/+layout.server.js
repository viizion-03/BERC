import { UserProfileService } from '$lib/services/backend-services.js';
import { redirect } from '@sveltejs/kit';
import { loadFlash } from 'sveltekit-flash-message/server';
// @ts-ignore
import { Query } from 'appwrite';
import { createSessionClient } from '$lib/services/appwrite-auth.js';

// @ts-ignore
export const load = async ({ locals }) => {
	//get user profile data

	const getProfile = async () =>
		// @ts-ignore
		new UserProfileService().get(locals.user.$id, [Query.select(['firstname', 'surname'])]);

	// @ts-ignore
	return { user: locals.user, userProfile: getProfile() };
};

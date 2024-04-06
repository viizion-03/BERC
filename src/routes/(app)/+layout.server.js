import { UserProfileService, VacancyService } from '$lib/services/backend-services.js';
import { redirect } from '@sveltejs/kit';
import { loadFlash } from 'sveltekit-flash-message/server';
// @ts-ignore
import { Query } from 'appwrite';

// @ts-ignore
export const load = async ({ locals }) => {
	async function getVacancies() {
		return new VacancyService().list();
	}

	const getProfile = async () =>
		// @ts-ignore
		new UserProfileService().get(locals.user.$id, [Query.select(['firstname', 'surname'])]);

	return {
		// @ts-ignore
		user: locals.user,
		userProfile: getProfile(),
		vacancies: getVacancies()
	};
};

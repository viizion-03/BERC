import { setError, superValidate } from 'sveltekit-superforms';
import { ID } from 'node-appwrite';
import { vacancySchema } from '$lib/zodSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import {
	UserProfileService,
	VacancyService
} from '$lib/services/backend-services.js';
import { redirect, } from 'sveltekit-flash-message/server';

export const load = async ({ locals }) => {
	const getOrganizations = async () =>
		new UserProfileService().get(locals.user.$id).then((res) => {
			if ('doc' in res) return res.doc.organizations;
		});

	return { organizations: getOrganizations() };
};

export const actions = {
	create: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(vacancySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const vacancyService = new VacancyService();
		vacancyService.create(data).then(res => {
			if(res.success){
				redirect(
					`/vacancies/${res.$id}`,
					{ type: 'success', message: 'Job vacancy posted successfully' },
					cookies
				);
			}else{
				return fail(500, {form})
			}
		});
	}
};

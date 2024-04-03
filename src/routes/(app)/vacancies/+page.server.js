import { setError, superValidate } from 'sveltekit-superforms';
import { ID } from 'appwrite';
import { vacancySchema } from '$lib/zodSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { VacancyService } from '$lib/services/backend-services.js';
import { createAdminClient } from '$lib/services/appwrite-auth.js';

export const actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod(vacancySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const vacancyService = new VacancyService();
		console.log('creating the tings');

		const { db } = createAdminClient();

		return db
			.createDocument('65cffe2a65e4ac1caf55', '65da072f315d1ef8c141', ID.unique(), data)
			.then((res) => {
				redirect(301, `/vacancies/${res.$id}`);
			})
			.catch((error) => {
				if ('status' in error) redirect(error.status,error.location); 
			});
		// return vacancyService.create(data ).then((res) => {
		// 	if (res.success) return redirect(301, '/account/vacancies/');
		// 	else if ('error' in res) {
		// 		setError(form, res.errorMessage);
		//         console.log(form)
		// 		return fail(400, { form });
		// 	}
		// });
	}
};

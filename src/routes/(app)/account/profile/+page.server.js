import { z } from 'zod';
import { EducationService, UserProfileService } from '$lib/services/backend-services';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { profileSchema, educationSchema } from '$lib/zodSchema.js';
import { redirect } from 'sveltekit-flash-message/server';
import { Query } from 'node-appwrite';
import { NodeStorageService } from '$lib/services/NodeStorageService';


export const load = async (event) => {
	// @ts-ignore
	const getProfile = async () => new UserProfileService(event).get(event.locals.user.$id);
	const getEducations = async () => new EducationService(event).list();
	const profileForm = await superValidate(zod(profileSchema));
	const educationForm = await superValidate(zod(educationSchema));
	const deleteEducationForm = await superValidate(zod(z.object({ educationId: z.string(),certificateSID: z.string().optional() })));

	return {
		profile: getProfile(),
		educations: getEducations(),
		profileForm,
		educationForm,
		deleteEducationForm
	};
};

export const actions = {
	updateProfile: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(profileSchema));
		// console.log('errors',form.errors)
		console.log('Profile data', form.data);

		if (!form.valid) {
			return message(form, { type: 'error' }, { status: 400 });
		}

		return message(form, { type: 'success' });
	},
	addEducation: async (event) => {
		const edForm = await superValidate(event.request, zod(educationSchema));
		console.log('Education data', edForm.data);
		console.log(edForm.errors);
		if (!edForm.valid) return message(edForm, { type: 'error' }, { status: 400 });

		// return redirect({type:'success', message:'Successfull tings'},event)

		const education = new EducationService(event);
		education.setData(edForm.data);
		return education
			.create()
			.then((res) => {
				return message(
					edForm,
					{ type: 'success', text: 'Education Added successfully', res },
					{ status: 400 }
				);
			})
			.catch((e) => {
				return message(
					edForm,
					{ type: 'error', text: 'Error in adding education' },
					{ status: 500 }
				);
			});
	},

	deleteEducation: async (event) => {
		const form = await superValidate(event.request, zod(z.object({ educationId: z.string() ,certificateSID: z.string().optional() })));
		return new EducationService(event).delete(form.data.educationId).then((res) => {
			if(form.data.certificateSID) new NodeStorageService(event).delete('certificates', form.data.certificateSID);

			if (res.success)
				return message(form, { type: 'success', text: 'Education Deleted Successfully' });
			else
				return message(form, { type: 'error', text: 'Error deleting Education' }, { status: 500 });
		});
	}
};

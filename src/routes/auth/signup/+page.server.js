import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { LocalService } from '$lib/services/appwrite.js';
import { createAdminClient, SESSION_COOKIE } from '$lib/services/appwrite-auth.js';
import { ID, OAuthProvider } from 'node-appwrite';
import { UserProfileService } from '$lib/services/backend-services.js';
import { redirect } from 'sveltekit-flash-message/server';

const loginSchema = z
	.object({
		email: z.string().email().min(1).trim(),
		password: z.string().min(8, 'Password must be have 8 or more characters').trim(),
		confirmPassword: z.string().min(8, 'Password must be have 8 or more characters').trim(),
		omangPassport: z.string().min(1).trim(),
		firstname: z.string().min(1).trim(),
		surname: z.string().min(1).trim(),
		dob: z.date(),
		nationality: z.string().default('Botswana'),
		username: z.string().trim()
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const load = async (event) => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, username, omangPassport, dob, firstname, surname, nationality } =
			form.data;

		const { account } = createAdminClient();

		await account.create(ID.unique(), email, password, username);

		
		const session = await account.createEmailPasswordSession(email, password);
		
		cookies.set(SESSION_COOKIE, session.secret, {
			sameSite: 'strict',
			expires: new Date(session.expire),
			secure: true,
			path: '/'
		});

		const profileService = new UserProfileService(omangPassport,firstname,surname,dob.toString(),nationality);
		await profileService.create()

		redirect('/account', {type:'success', message: 'Login Successful'}, cookies);
	}
};

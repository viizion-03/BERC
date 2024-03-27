import { z } from 'zod';
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { createAdminClient, SESSION_COOKIE } from '$lib/services/appwrite-auth.js';
import { redirect } from '@sveltejs/kit';
import { ID, OAuthProvider } from 'node-appwrite';
import { AppwriteException } from 'appwrite';

const loginSchema = z.object({
	email: z.string().email().min(1).trim(),
	password: z.string().min(8, 'Password must be have 8 or more characters').trim(),
	rememberMe: z.boolean()
});

export const load = async (event) => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;
		const { account } = createAdminClient();
		try {
			const session = await account.createEmailPasswordSession(email, password);

			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/'
			});
		} catch (error) {
			if (error instanceof AppwriteException && error.code === 400) {
				setError(form, 'Invalid email or password');
				console.log(error)
				return fail(400, { form });
			}

			// setError(form,'Could not log in, Try again Later');
			// @ts-ignore
			setError(form,error.message);
			console.log(form)
			return fail(400,{form})
		}
		redirect(301, '/account');
	}
};

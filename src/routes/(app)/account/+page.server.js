
import { SESSION_COOKIE, createSessionClient } from '$lib/services/appwrite-auth.js';
import { redirect } from 'sveltekit-flash-message/server';

export const actions = {
	logout: async (event) => {
		const { account } = createSessionClient(event);

		await account.deleteSession('current');
		event.cookies.delete(SESSION_COOKIE, { path: '/' });

		redirect(301, '/auth/login');
	}
};

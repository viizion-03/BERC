
import { SESSION_COOKIE, createNodeClient } from '$lib/services/appwrite-auth.js';
import { redirect } from 'sveltekit-flash-message/server';

export const actions = {
	logout: async (event) => {
		const { account } = createNodeClient(event);

		await account.deleteSession('current');
		event.cookies.delete(SESSION_COOKIE, { path: '/' });

		redirect(301, '/auth/login');
	}
};

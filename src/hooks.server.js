import { createSessionClient } from '$lib/services/appwrite-auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	try {
		const { account } = createSessionClient(event);
		// @ts-ignore
		event.locals.user = await account.get();

		if (!event.locals.user) {
			redirect(301, '/auth/login');
		} else {
			if (event.url.pathname.startsWith('/auth')) {
				redirect(301, '/');
			}
		}
	} catch (error) {}

	return resolve(event);
}

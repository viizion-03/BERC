import { createSessionClient } from '$lib/services/appwrite-auth';

export async function handle({ event, resolve }) {
	try {
		const { account } = createSessionClient(event);
		// @ts-ignore
		event.locals.user = await account.get();
	} catch (error) {
		// console.log(error);
	}

	return resolve(event);
}

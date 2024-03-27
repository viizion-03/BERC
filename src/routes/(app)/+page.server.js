import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	// @ts-ignore
	if (!locals.user) {
		redirect(301, '/auth/login');
	}

	return {}
}

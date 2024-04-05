import { createSessionClient } from '$lib/services/appwrite-auth';
import { SESSION_COOKIE } from '$lib/services/appwrite-auth';
import { redirect } from '@sveltejs/kit';


export async function handle({ event, resolve }) {

	//check for session cookie 
	const session = event.cookies.get(SESSION_COOKIE)
	
	//redirect to login if no session
	if(!session) redirect(301, '/auth/login')

	//redirect to home if session is there but request is for login/signup page
	else if(event.url.pathname.startsWith('auth')) redirect(301, '/')

	//load up user data into locals
	const {account} = createSessionClient(event);
	// @ts-ignore
	event.locals.user = await account.get().then(res => res)

	return resolve(event);
}


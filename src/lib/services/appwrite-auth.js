// src/lib/server/appwrite.js
import { Client, Account, Databases } from 'node-appwrite';
import {APPWRITE_KEY} from '$env/static/private'
// import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from '$env/static/public';

const config = {
	endPoint: 'https://appwrite.waterwolf.tech/v1',
	project: '65cb6350e2738c5d0f96'
};

export const SESSION_COOKIE = 'berc-session';

export function createAdminClient() {
	const client = new Client()
		.setEndpoint(config.endPoint)
		.setProject(config.project)
		.setKey(APPWRITE_KEY); 

	return {
		get account() {
			return new Account(client);
		},
        get db() {
            return new Databases(client);
        }
	};
}

/**
 * @param {{ cookies: { get: (arg0: string) => any; }; }} event
 */
export function createSessionClient(event) {
    const client = new Client()
        .setEndpoint(config.endPoint)
        .setProject(config.project);

    const session = event.cookies.get(SESSION_COOKIE);
    if (!session) {
        throw new Error("No user session");
    }

    client.setSession(session);

    return {
        get account() {
            return new Account(client);
        },
        get db(){
            return new Databases(client);
        }
    };
}

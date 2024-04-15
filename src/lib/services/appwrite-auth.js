// src/lib/server/appwrite.js
import {
	Client as NodeClient,
	Account as NodeAccount,
	Databases as NodeDatabases,
    Storage as NodeStorage
} from 'node-appwrite';

import { APPWRITE_KEY } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from '$env/static/public';

export const SESSION_COOKIE = 'berc-session';

export function createAdminClient() {
	const client = new NodeClient()
		.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
		.setProject(PUBLIC_APPWRITE_PROJECT)
		.setKey(APPWRITE_KEY);

	return {
		get account() {
			return new NodeAccount(client);
		},
		get db() {
			return new NodeDatabases(client);
		},
        get storage(){
            return new NodeStorage(client)
        }
	};
}

/**
 * @param {{ cookies: { get: (arg0: string) => any; }; }} event
 */
export function createNodeClient(event) {
	const client = new NodeClient().setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT);

	const session = event.cookies.get(SESSION_COOKIE);
	if (!session) {
		throw new Error('No user session');
	}

	client.setSession(session);

	return {
		get account() {
			return new NodeAccount(client);
		},
		get db() {
			return new NodeDatabases(client);
		},
        get storage() {
            return new NodeStorage(client)
        }
	};
}



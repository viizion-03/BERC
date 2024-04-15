import { Client, Account, Databases, Storage } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from '$env/static/public';


export function createBrowserClient() {
    const client = new Client().setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT);
    return {
        get account() {
            return new Account(client);
        },
        get db() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    };
}

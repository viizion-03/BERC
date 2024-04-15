import { StorageService } from './appwrite';
import { createNodeClient } from './appwrite-auth';

export class NodeStorageService extends StorageService {
	constructor(event) {
		super();
		const { storage } = createNodeClient(event);
		this.storage = storage;
	}
}

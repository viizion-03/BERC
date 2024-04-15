import { ID } from 'node-appwrite';
import { mainDb, handleError } from './appwrite';
import { createNodeClient } from './appwrite-auth';

export class DBService {
	db;

	databaseId = mainDb.databaseID;
	collectionId = '';
	requiredAttributes = {};

	/**
	 * @type {object | undefined}
	 */
	data;

	/**
	 * object containing IDs of all collections in the main database within appwrite
	 */
	constructor(event) {
		const { db } = createNodeClient(event);
		this.db = db;
	}
	/**
	 * @param {object} data Key value pairs based on collection attributes
	 * @param {string} id Document primary ID, if not entred ID.unique() is used to generate a new primary key
	 * @returns
	 */
	// * @param {{omangPassport:string, firstname:string, dob:string, nationality:string, surname:string}} data Profile Object containing key value pairs
	async create(data = {}, id = '') {
		const docId = id ? id : ID.unique();

		return this.db
			.createDocument(this.databaseId, this.collectionId, docId, {
				...this.requiredAttributes,
				...this.data,
				...data
			})
			.then((doc) => {
				return { success: true, doc };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Retrieves a document of the specified ID
	 *
	 * The list of queries applies when configuring which attributes should be returned using
	 * the Select function
	 *
	 * @param {string} documentId ID of the document
	 * @param {string[]} queryList list of Appwrite queries mainly for the Select function (attributes)
	 * @returns
	 */
	async get(documentId, queryList = []) {
		return this.db
			.getDocument(this.databaseId, this.collectionId, documentId, queryList)
			.then((doc) => {
				return { success: true, doc };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Returns a list of documents that match with the specified queries passed into the function
	 *
	 * @param {string[]} queryList List of queries generated using the Query function from appwrite
	 * @returns
	 */
	async list(queryList = []) {
		return this.db
			.listDocuments(this.databaseId, this.collectionId, queryList)
			.then((docs) => {
				return { success: true, docs };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Updates the attributes of the document  with the provided ID
	 *
	 * @param {string} id Document primary ID
	 * @param {object} data Key value pairs of attributes that are to be updated
	 * @returns
	 */
	async update(id, data = {}) {
		return this.db
			.updateDocument(this.databaseId, this.collectionId, id, { ...this.data, ...data })
			.then((doc) => {
				return { success: true, doc };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Deletes the Document of the provided ID from the Database
	 *
	 * @param {string} id Primary ID of the Document to be deleted
	 * @returns
	 */
	async delete(id) {
		return this.db
			.deleteDocument(this.databaseId, this.collectionId, id)
			.then(() => {
				return { success: true };
			})
			.catch((err) => handleError(err));
	}
}

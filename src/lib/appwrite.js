import { Databases, Client, Storage, Account, ID, AppwriteException, Query } from 'appwrite';

/**
 * object containing the project ID and endpoint of appwrite
 */
const config = {
	endPoint: 'https://appwrite.waterwolf.tech/v1',
	project: '65cb6350e2738c5d0f96'
};

const handleError = (/** @type {any}} */ error) => {
	if (error instanceof AppwriteException) {
		let message;

		switch (error.type) {
			case 'general_unauthorized_scope':
				message = 'User Not Logged In';
				break;
			case 'user_already_exists':
				message = 'A user with the same id, email, or phone already exists';
				break;
			case 'user_email_already_exists':
				message = 'A user with the same email already exists';
				break;
			case 'user_phone_already_exists':
				message = 'A user with the same phone number already exists';
				break;

			case 'document_not_found':
				message = 'Record not found';

			default:
				message = error.message;
		}

		return { success: false, errorMessage: message, error };
	} else {
		return { success: false, errorMessage: error.message, error };
	}
};

export class AuthService {
	client = new Client();
	auth;

	constructor() {
		this.client.setEndpoint(config.endPoint);
		this.client.setProject(config.project);

		this.auth = new Account(this.client);
	}

	/**
	 * Gets the User object of the current user
	 *
	 * @returns
	 */
	async getUser() {
		try {
			return this.auth.get().then((user) => {
				return { success: true, user };
			});
		} catch (error) {
			return { ...handleError(error), user: null };
		}
	}

	/**
	 * Creates a new User Account if it doesn't already exist
	 * @param {string} name Display name of the User
	 * @param {string} email User email
	 * @param {string} password New password for the user
	 * @param {string} id Optional - Primary key for the User Account ie. Omang/Passport
	 * @returns
	 */
	async createAccount(name, email, password, id = '') {
		const userID = id ? id : ID.unique();
		return this.auth
			.create(userID, email, password, name)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Upadate a User accounts Email
	 *
	 * @param {string} email New User Email
	 * @param {string} password confirm password of user
	 * @returns
	 */
	async updateEmail(email, password) {
		const promise = this.auth
			.updateEmail(email, password)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));

		return promise;
	}

	/**
	 * Changes the Username of the user's account
	 * @param {string} name New user account name
	 * @returns
	 */
	async updateName(name) {
		return this.auth
			.updateName(name)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Changes the User password
	 *
	 * @param {string} oldPwd Old User Password
	 * @param {string} newPwd New User Password
	 * @returns
	 */
	async updatePassword(newPwd, oldPwd) {
		return this.auth
			.updatePassword(newPwd, oldPwd)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => {
				if (err.type === 'user_invalid_credentials')
					return { success: false, errorMessage: 'Old Password is incorrenct', error: err };
				handleError(err);
			});
	}

	/**
	 * Updates the User's phone number
	 *
	 * @param {string} contact Phone number with leadind "+" and country code eg +2677819341
	 * @param {string} password User password
	 * @returns
	 */
	async updatePhone(contact, password) {
		return this.auth
			.updatePhone(contact, password)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Get the user preferences. preferences are in a object format{}
	 * @returns
	 */
	async getPrefs() {
		return this.auth
			.getPrefs()
			.then((prefs) => {
				return { success: true, prefs };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Updates the currently logged in User's Preferences
	 *
	 * @param {object} prefs Key Value pairs for the user preferences
	 * @returns
	 */
	async updatePrefs(prefs) {
		return this.auth
			.updatePrefs(prefs)
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Sends the User a temporary secret key for password reset
	 * and returns email and key to be used by the recovery confirmation function
	 *
	 * Link valid for 1 hour
	 * @param {string} email User email
	 * @param {string} url URL to redirect the user back from recovery email
	 * @returns
	 */
	async sendPasswordRecovery(email, url) {
		return this.auth
			.createRecovery(email, url)
			.then((token) => {
				return { success: true, token };
			})
			.catch((error) => handleError(error));
	}

	/**
	 * Completes the user's account password reset
	 * @param {string} id User's Account ID
	 * @param {string} secret Valid reset token recieved from creating a password recovery
	 * @param {string} password The User's new Password must be at least 8 characters
	 * @param {string} repeatPassword Confirmatory repeat for the user's new password
	 * @returns
	 */
	async confirmPasswordRecovery(id, secret, password, repeatPassword) {
		return this.auth
			.updateRecovery(id, secret, password, repeatPassword)
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Get a list of the logged in user's current sessions across all devices
	 * @returns
	 */
	async listSessions() {
		return this.auth
			.listSessions()
			.then((sessions) => {
				return { success: true, sessions };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Deletes all sessions of the logged in user & removes all session cookies from the end client
	 * @returns
	 */
	async deleteAllSessions() {
		return this.auth
			.deleteSessions()
			.then(() => {
				return { success: true };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Create a email session for the user
	 *
	 * @param {string} email User email
	 * @param {string} password User password
	 * @returns
	 */
	async emailLogin(email, password) {
		return this.auth
			.createEmailSession(email, password)
			.then((session) => {
				return { success: true, session };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Sends an sms to the user with a secret key.
	 *
	 * If the User ID has not been registered, a new user will be created. The returned userID
	 * should then be used on the phone session confirmation endpoint complete the login process.
	 *
	 * Secret sent is only valid for 15 minutes.
	 * Only 10 requests are allowed within 60 minutes.
	 *
	 * @param {string} id User's Account ID
	 * @param {string} phone User's Phone Number with a leading  "+" sign (e.g., +26771765154)
	 * @returns
	 */
	async phoneLogin(id, phone) {
		return this.auth
			.createPhoneSession(id, phone)
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Completes the Phone login process and officially creates the session
	 *
	 * @param {string} id User's Account ID
	 * @param {string} secret Verification Token Received by the User
	 * @returns
	 */
	async confirmPhoneLogin(id, secret) {
		return this.auth
			.updatePhoneSession(id, secret)
			.then((session) => {
				return { success: true, session };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Gets the session details of a logged in user's session
	 *
	 * Using 'current'  returns the current active session being used
	 * @param {string} sessionId ID of the requested session
	 * @returns
	 */
	async getSession(sessionId) {
		return this.auth
			.getSession(sessionId)
			.then((session) => {
				return { success: true, session };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Logout the user by deleting a specific session
	 *
	 * Use ID to logout from another device
	 *
	 * User 'current' to logout from current device
	 *
	 * @param {string} sessionId ID of the session to be deleted | 'current' for current session
	 * @returns
	 */
	async logout(sessionId) {
		return this.auth
			.deleteSession(sessionId)
			.then(() => {
				return { success: true };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Blocks the currently logged in user but their account still remains in the database
	 *
	 * This Action is PERMANENT
	 * @returns
	 */
	async updateStatus() {
		return this.auth
			.updateStatus()
			.then((user) => {
				return { success: true, user };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Sends an verification message to the user's email address to confirm validity
	 *
	 * Verification link is valid for 7 days
	 *
	 * @param {string} url Url to redirect the user back to the app from verification email
	 * @returns
	 */
	async sendEmailVerification(url) {
		return this.auth
			.createVerification(url)
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Completes the email verification process
	 *
	 * Use both the userId and secret parameters that were attached to your
	 * app URL to verify the user email ownership
	 * @param {string} userId User's Account ID
	 * @param {string} secret Verification token sent to the user
	 * @returns
	 */
	async confirmEmail(userId, secret) {
		return this.auth
			.updateVerification(userId, secret)
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Sends a verification sms to the currently logged in User. use the phone
	 * verification endpoint to complete the process
	 *
	 * Verification code is valid for 15 minutes
	 * @returns
	 */
	async sendPhoneVerification() {
		return this.auth
			.createPhoneVerification()
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Completes the user's phone verification process.
	 *
	 * Use the userId and secret that were sent to your user's phone number to verify
	 * the user email ownership
	 * @param {string} userId User's Account Id
	 * @param {string} secret Verification token
	 * @returns
	 */
	async confirmPhone(userId, secret) {
		return this.auth
			.updatePhoneVerification(userId, secret)
			.then((token) => {
				return { success: true, token };
			})
			.catch((err) => handleError(err));
	}
}
export const mainDb = {
	databaseID: '65cffe2a65e4ac1caf55',
	collections: {
		messages: '65da2e313e61cd9ec368',
		chatRooms: '65da1ecbccdd8a19944c',
		forumComments: '65da1b313e4156c62a31',
		forums: '65da1a114ebcee58ef43',
		vacancyNotifications: '65da184a880fecbb724a',
		applicantnNotes: '65da13b8d63166feaa66',
		vacancyApplications: '65da11ddcbc8ec1250bb',
		vacancies: '65da072f315d1ef8c141',
		notifications: '65d932d5a7bf501dd37c',
		socialMediaAccounts: '65d9304ed31d5d1c9509',
		organizations: '65d925ab10d43ec51b3c',
		userLanguages: '65d92425ed4facc9106e',
		workExperiences: '65d9161ab43a30cb78ca',
		projects: '65d219a74329731159d2',
		signedReferences: '65d218bb9da9a2e3456d',
		siteReferences: '65d20e28e850f1686f1e',
		educations: '65d0e7b4a60393b375ae',
		userBiographies: '65d0d74f2a513cb8337b',
		userProfiles: '65cffe8b792bb31cbb45'
	}
};

export class DBService {
	client = new Client();
	db = new Databases(this.client);

	databaseId = '';
	collectionId = '';
	requiredAttributes = {}

	/**
	 * @type {object | undefined}
	 */
	data

	/**
	 * object containing IDs of all collections in the main database within appwrite
	 */
	constructor() {
		this.client.setEndpoint(config.endPoint);
		this.client.setProject(config.project);
		this.databaseId = mainDb.databaseID;
	}
	/**
	 *	@param {object} data Key value pairs based on collection attributes
	 * @param {string} id Document primary ID, if not entred ID.unique() is used to generate a new primary key
	 * @returns
	 */
	// * @param {{omangPassport:string, firstname:string, dob:string, nationality:string, surname:string}} data Profile Object containing key value pairs
	async create(data={}, id = '') {
		const docId = id ? id : ID.unique();

		return this.db
			.createDocument(this.databaseId, this.collectionId, docId, {...this.requiredAttributes,...this.data, ...data })
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
	async update(id, data) {
		return this.db
			.updateDocument(this.databaseId, this.collectionId, id, {...this.data, ...data})
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
	
	export class StorageService {
		/**
		 * @typedef {('avatars'|'references'|'projects'|'certificates'|'coverPhotos'|'introAudios'|'messageMedia')} BucketName
		 */
		client = new Client();
		storage = new Storage(this.client);
		
	buckets = {
		projects: '65d21b3c544d84d4dac7',
		certificates: '65d0d6b3b3797dd487ad',
		references: '65d0d428d5a03673f1cd',
		coverPhotos: '65d0d16c9f7aae6bf573',
		introAudios: '65d0ceb1c7c45b65566e',
		avatars: '65d0cbf20c9b0c907251',
		messageMedia: "65f4def1e7eec7823f4b"
	};
	
	constructor() {
		this.client.setEndpoint(config.endPoint);
		this.client.setProject(config.project);
	}

	/**
	 * Returns a list of files from the specified Storage Bucket
	 *
	 * @param {BucketName} bucket ID of the Bucket to list files from
	 * @param {string | undefined} search Search parameter to filter the list of files
	 * @param {string[]} queryList
	 * @returns
	 */
	async list(bucket, search = undefined, queryList = []) {
		return this.storage
			.listFiles(this.buckets[bucket], queryList, search)
			.then((list) => {
				return { success: true, list };
			})
			.catch((err) => handleError(err));
	}


	/**
	 * Uploads a new file to the Specified Storage Bucket
	 *
	 * @param {BucketName} bucket ID for the bucket to store the file
	 * @param {File} file Binary file for the file to be uploaded
	 * @returns
	 */
	async create(bucket, file) {
		return this.storage
			.createFile(this.buckets[bucket], ID.unique(), file)
			.then((file) => {
				return { success: true, file };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Returns the file object of the requested file
	 *
	 * @param {BucketName} bucket ID of the  bucket that contains the file
	 * @param {string} fileId ID of the requested file
	 * @returns
	 */
	async get(bucket, fileId) {
		return this.storage
			.getFile(this.buckets[bucket], fileId)
			.then((file) => {
				return { success: true, file };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Updates the filename of the specified File
	 *
	 * @param {BucketName} bucket ID of the bucket that contains the file
	 * @param {string} fileId ID of the file to be updated
	 * @param {string} name New Name for the file
	 * @returns
	 */
	async update(bucket, fileId, name) {
		return this.storage
			.updateFile(this.buckets[bucket], fileId, name)
			.then((file) => {
				return { success: true, file };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Deletes the specified file from storage
	 * @param {BucketName} bucket ID of the bucket containing the file
	 * @param {string} fileId ID of the file to be deleted
	 * @returns
	 */
	async delete(bucket, fileId) {
		return this.storage
			.deleteFile(this.buckets[bucket], fileId)
			.then(() => {
				return { success: true };
			})
			.catch((err) => handleError(err));
	}

	/**
	 * Get a file content by its unique ID.
	 *
	 * The endpoint response return with a 'Content-Disposition: attachment' header that tells
	 * the browser to start downloading the file to user downloads directory.
	 *
	 * @param {BucketName} bucket ID of the bucket containing the file
	 * @param {string} fileId ID of the file to be downloaded
	 * @returns
	 */
	getFileDownload(bucket, fileId) {
		try {
			const url = this.storage.getFileDownload(this.buckets[bucket], fileId);
			return { success: true, url };
		} catch (error) {
			return handleError(error);
		}
	}

	/**
	 * Get a file preview Image for image files.
	 *
	 * File Icon returned for all other file types
	 *
	 * @param {BucketName} bucket ID of the bucket containing the file
	 * @param {string} fileId ID of the file to be previewed
	 * @returns
	 */
	getFilePreview(bucket, fileId) {
		try {
			const url = this.storage.getFilePreview(this.buckets[bucket], fileId);
			return { success: true, url };
		} catch (error) {
			return handleError(error);
		}
	}

	/**
	 * Opens the file in the browser to be Viewed
	 *
	 * @param {BucketName} bucket ID of the bucket containing the file
	 * @param {string} fileId ID of the file to be Viewed
	 * @returns
	 */
	getFileView(bucket, fileId) {
		try {
			const url = this.storage.getFileView(this.buckets[bucket], fileId);
			return { success: true, url };
		} catch (error) {
			return handleError(error);
		}
	}
}

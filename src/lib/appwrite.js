import { Databases, Client, Storage, Account, ID } from 'appwrite';

/**
 * object containing IDs of all collections in the main database within appwrite
 */
const mainDb = {
	databaseID: '65cffe2a65e4ac1caf55',
	collections: [
		{
			messages: '65da2e313e61cd9ec368',
			chatRooms: '65da1ecbccdd8a19944c',
			forumComments: '65da1b313e4156c62a31',
			forums: '65da1a114ebcee58ef43',
			vacancyNotifications: '65da184a880fecbb724a',
			applicationNotes: '65da13b8d63166feaa66',
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
	]
};

const success = { success: true, error: false };
const fail = { success: false, error: true };

/**
 * object containing the project ID and endpoint of appwrite
 */
const config = {
	endPoint: 'https://appwrite.waterwolf.tech/v1',
	project: '65cb6350e2738c5d0f96'
};

export class AuthService {
	client = new Client();
	auth;

	constructor() {
		try {
			this.client.setEndpoint(config.endPoint);
			this.client.setProject(config.project);

			this.auth = new Account(this.client);
		} catch (error) {
			console.log(error);
		}
	}

	async getUser() {
		try {
			return this.auth?.get();
		} catch (error) {
			console.log('Kiss my ass');
		}
	}

	/**
	 * Creates a new User Account if it doesn't already exist
	 * @param {string} name Display name of the User
	 * @param {string} email User email
	 * @param {string} password New password for the user
	 * @param {string} id Optional - Primary key for the User Account ie. Omang/Passport
	 * @returns object {error, user}
	 */
	async createAccount(name, email, password, id = '') {
		const userID = id ? id : ID.unique();
		return this.auth
			?.create(userID, email, password, name)
			.then((user) => {
				return { error: false, user: user };
			})
			.catch((err) => {
				if (err.type === 'user_already_exists')
					return { error: true, errorMessage: 'Account already exists', errorObj: err };
				if (err.type === 'user_count_exceeded')
					return {
						error: true,
						errorMessage: 'Account creation limit exceeded, please contact Administrator',
						errorObj: err
					};
			});
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
			?.updateEmail(email, password)
			.then((user) => {
				return { ...success, user: user };
			})
			.catch((err) => {
				if (err.code === 401) return { error: err, errorMessage: 'User not logged in' };

				return { err: err };
			});

		return promise;
	}

	/**
	 * Changes the Username of the user's account
	 * @param {string} name New user account name
	 * @returns
	 */
	async updateName(name) {
		return this.auth
			?.updateName(name)
			.then((user) => {
				return { ...success, user: user };
			})
			.catch((err) => {
				if (err.code === 401) return { error: err, errMessage: 'User not logged in' };
				return { err: err };
			});
	}

	/**
	 * Changes the User password
	 *
	 * @param {string} oldPwd Old User Password
	 * @param {string} newPwd New User Password
	 * @returns
	 */
	async updatePassword(oldPwd, newPwd) {
		return this.auth
			?.updatePassword(oldPwd, newPwd)
			.then((user) => {
				return { ...success, user: user };
			})
			.catch((err) => {
				if (err.code === 401) return { error: err, errMessage: 'User not logged in' };
				return { err: err };
			});
	}

	/**
	 * Update the User's phone number
	 *
	 * @param {string} contact Phone number with leadind "+" and country code eg +2677819341
	 * @param {string} password User password
	 * @returns
	 */
	async updatePhone(contact, password) {
		return this.auth
			?.updatePhone(contact, password)
			.then((user) => {
				return { ...success, user: user };
			})
			.catch((err) => {
				if (err.code === 401) return { error: err, errMessage: 'User not logged in' };
				return { err: err };
			});
	}

	/**
	 * Get the user preferences. preferences are in a object format{}
	 * @returns
	 */
	async getPrefs() {
		return this.auth
			?.getPrefs()
			.then((prefs) => {
				return { ...success, prefs: prefs };
			})
			.catch((err) => {
				if (err.code === 401) return { error: err, errMessage: 'User not logged in' };
				return { err: err };
			});
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
			?.createEmailSession(email, password)
			.then((session) => {
				return { ...success, session: session };
			})
			.catch((err) => {
				if (err.type === 'user_invalid_credentials')
					return { error: err, errMessage: 'Invalid email or password' };
				return { err: err };
			});
	}

	async deleteAllSessions() {
		return this.auth?.deleteSessions().then((res) => {
			return { ...success };
		}).catch(err => {return {success: false, error: err}});
	}
}

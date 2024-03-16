import { AuthService, DBService, mainDb, StorageService } from './appwrite';

export class UserProfileService extends DBService {
	/**
	 * @typedef {Object}  UserProfile
	 * @property {string} omangPassport - The user's OMANG passport number.
	 * @property {string} firstname - The user's first name.
	 * @property {string[]} middleNames - The user's middle names.
	 * @property {Date} dob - The user's date of birth.
	 * @property {string} sex - The user's sex (male/female/other).
	 * @property {string} nationality - The user's nationality.
	 * @property {string[]} contacts - List of phone numbers with leading +267.
	 * @property {string[]} emails - List of email addresses.
	 * @property {string} Occupation - The user's occupation.
	 * @property {string} currentCompany - The user's current company.
	 * @property {string} Location - The user's location (town, city, village).
	 * @property {string} District - The user's district.
	 * @property {string} physicalAddress - The user's physical address.
	 * @property {string} highlights - The user's highlights.
	 * @property {boolean} isVerified - Whether the user is verified.
	 * @property {string} avatarSID - The user's avatar SID.
	 * @property {string} introAudioSID - The user's intro audio SID.
	 * @property {string} coverPhotoSID - The user's cover photo SID.
	 * @property {string} surname - The user's surname.
	 * @property {string} $id - The user's ID.
	 * @property {Date} $createdAt - The user's creation date.
	 * @property {Date} $updatedAt - The user's last updated date.
	 * @property {string[]} $permissions - The user's permissions.
	 * @property {Object[]} projects - The user's projects.
	 * @property {string} userBiography - The user's biography.
	 * @property {string[]} userLanguages -The user's languages.
	 * @property {Object[]} socialMediaAccounts - The user's social media accounts.
	 * @property {Object[]} organizations - The user's organizations.
	 * @property {Object[]} notifications - The user's notifications.
	 * @property {Object[]} vacancyApplications - The user's vacancy applications.
	 * @property {Object[]} applicantNotes - The user's applicant notes.
	 * @property {Object[]} forumComments - The user's forum comments.
	 * @property {Object[]} forums - The user's forums.
	 * @property {string} $databaseId - The user's database ID.
	 * @property {string} $collectionId - The user's collection ID.
	 */

	/** @type {UserProfile | undefined} */
	data;

	constructor(omangPassport = '', firstname = '', surname = '', dob = '', nationality = '') {
		super();
		this.collectionId = mainDb.collections.userProfiles;
		this.requiredAttributes = { omangPassport, firstname, dob, surname, nationality };
	}

	/**
	 * Creates a new Account then proceeds to create a User Profile
     * 
     * If the desire is to only create a profile. Use the Create() function
     * 
     * For just creating an Account on appwrite. Use the CreateAccount() function in the AuthService class
	 *
	 * @param {string} username Name for the user's account
	 * @param {string} email New User's email
	 * @param {string} password Password for the User
	 */
	async signUp(username, email, password) {
		const auth = new AuthService();
		return auth
			.createAccount(username, email, password, this.requiredAttributes.omangPassport)
			.then((res) => {
				if (res.success) {
					const { user } = res;
					this.create(this.data, this.requiredAttributes.omangPassport).then((res) => {
						if (res.success) return { success: true, profile: res.doc, user: user };
					});
				}
			});
	}
}

export class MessageService extends DBService {
	/**
	 * @typedef {Object} AppwriteFile
	 * @property {string} $id - The unique ID of the file.
	 * @property {string} bucketId - The ID of the bucket where the file is stored.
	 * @property {string} $createdAt - The timestamp when the file was created.
	 * @property {string} $updatedAt - The timestamp when the file was last updated.
	 * @property {string[]} $permissions - An array of permissions for the file.
	 * @property {string} name - The name of the file.
	 * @property {string} signature - The signature of the file.
	 * @property {string} mimeType - The MIME type of the file.
	 * @property {number} sizeOriginal - The original size of the file in bytes.
	 * @property {number} chunksTotal - The total number of chunks the file is divided into.
	 * @property {number} chunksUploaded - The number of chunks that have been uploaded.
	 */

	/**
	 *
	 * @param {"text"|"audio"|"img"|"doc"} type
	 * @param {string} chatRoomId ID of the chatroom to send the message in
	 * @param {string} senderId ID of the user sending the message
	 */
	constructor(type, senderId, chatRoomId) {
		super();
		this.collectionId = mainDb.collections.messages;
		this.requiredAttributes = { type, senderProfile: senderId, chatRoom: chatRoomId };
	}

	/**
	 * Uploads the Media into storage then Creates a Message Record
	 *
	 * @param {string} text
	 * @param {File} file
	 * @returns
	 */
	async createUpload(file, text = '') {
		const storage = new StorageService();

		return storage.create('messageMedia', file).then((res) => {
			return this.create({ mediaSID: res.file.$id, text });
		});
		// 	.catch((error) => {
		// 		return { success: false, errorMessage: error.message, error };
		// 	});

		// const senderId = await new AuthService().getUser().then(res => res.user.$id)
		// if(senderId){
		// }else{
		//     return {success:false, errorMessage: "No user logged in."}
		// }
	}
}

export class ChatRoomService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.chatRooms;
	}
}

export class ForumCommentService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.forumComments;
	}
}

export class ForumService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.forums;
	}
}

export class VacancyNotificationService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.vacancyNotifications;
	}
}

export class ApplicantNoteService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.applicantnNotes;
	}
}

export class VacancyApplicationService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.vacancyApplications;
	}
}

export class VacancyService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.vacancies;
	}
}

export class NotificationService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.notifications;
	}
}

export class SocialMediaAccountService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.socialMediaAccounts;
	}
}

export class OrganizationService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.organizations;
	}
}

export class UserLanguageService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.userLanguages;
	}
}

export class WorkExperienceService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.workExperiences;
	}
}

export class ProjectService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.projects;
	}
}

export class SignedReferenceService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.signedReferences;
	}
}

export class SiteReferenceService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.siteReferences;
	}
}

export class EducationService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.educations;
	}
}

export class UserBiographyService extends DBService {
	constructor() {
		super();
		this.collectionId = mainDb.collections.userBiographies;
	}
}

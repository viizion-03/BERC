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
	 * @property {SiteReference} siteReferences - References Written by the User for other Users
	 */

	constructor(omangPassport = '', firstname = '', surname = '', dob = '', nationality = '') {
		super();
		this.collectionId = mainDb.collections.userProfiles;
		this.requiredAttributes = { omangPassport, firstname, dob, surname, nationality };
	}

	/**
	 *
	 * @param {UserProfile} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
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
				if (res.success && 'user' in res) {
					const { user } = res;
					this.create(this.data, this.requiredAttributes.omangPassport).then((res) => {
						if (res.success && 'doc' in res) return { success: true, profile: res.doc, user: user };
					});
				}
			});
	}
}

export class MessageService extends DBService {
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

		return storage
			.create('messageMedia', file)
			.then((res) => {
				if ('file' in res) return this.create({ mediaSID: res.file.$id, text });
			})
			.catch((error) => {
				return { success: false, errorMessage: error.message, error };
			});
	}
}

export class ChatRoomService extends DBService {
	constructor(name = '') {
		super();
		this.collectionId = mainDb.collections.chatRooms;
		this.requiredAttributes = { name };
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
	/**
	 * @typedef {Object} SignedReference
	 * @property {string} docsID - The document ID (required)
	 * @property {string} authorFullname - The author's full name (required)
	 * @property {string[]} [authorContacts] - The author's contacts
	 * @property {workExperience} workExperience - The work experience associated with this signed reference
	 * @property {Biography} userBiography - The biography to which this reference is for
	 */

	constructor(authorFullname = '', userBiography = '') {
		super();
		this.collectionId = mainDb.collections.signedReferences;
		this.requiredAttributes = { authorFullname, userBiography };
	}

	/**
	 *	Sets the attributes of the Signed Reference Collection
	 * @param {SignedReference} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}

	/**
	 * Uploads the Reference Document to Storage then proceeds to record a transaction in the database
	 *
	 * @param {File} file Reference File to be uploaded (.docx, pdf)
	 * @param {SignedReference|Object} data
	 * @returns
	 */
	async createUpload(file, data = {}) {
		const storage = new StorageService();
		const uploadedFile = await storage.create('references', file);
		if (uploadedFile.success && 'file' in uploadedFile) {
			return this.create({ ...data, docSID: uploadedFile.file.$id });
		}
		else{
			return {...uploadedFile}
		}
	}
}

export class SiteReferenceService extends DBService {
	/**
	 * @typedef {Object} SiteReference
	 * @property {string} relationshipToCandidate - The relationship to the candidate (required)
	 * @property {string} [candidateExperience] - The candidate's experience
	 * @property {string[]} [candidateCapabilities] - The candidate's capabilities
	 * @property {string} [impactCreated] - The impact created
	 * @property {string[]} [personalQualities] - The personal qualities
	 * @property {string} [potential] - The potential
	 * @property {string} summary - The summary (required)
	 * @property {string} [otherInformation] - Other information
	 * @property {workExperience} workExperience - The work experience associated with this site reference
	 * @property {UserProfile} authorProfile - The Account that created the site reference
	 * @property {Biography} userBiography - The Biography for the accout to which the reference belongs to
	 */

	// /**@type {SiteReference | undefined} */
	// data;
	constructor(relationshipToCandidate = '', summary = '', authorProfile = '', userBiography = '') {
		super();
		this.collectionId = mainDb.collections.siteReferences;
		this.requiredAttributes = { relationshipToCandidate, summary, authorProfile, userBiography };
	}

	/**
	 * Sets the Attributes within the Site References Collection
	 * @param {SiteReference} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}
}

export class EducationService extends DBService {
	/**
	 * @typedef {Object} Education
	 * @property {string} qualification - The qualification obtained (required)
	 * @property {string} institution - The educational institution (required)
	 * @property {string} startDate - The start date (required)
	 * @property {string} [endDate] - The end date
	 * @property {boolean} isSuccessfullyCompleted - Indicates whether the education was successfully completed
	 * @property {string} [certificatesID] - The certificate ID
	 * @property {Biography | string} userBiography - The user biography associated with this education
	 */

	constructor(qualification = '', institution = '', startDate = '', biographyId = '') {
		super();
		this.collectionId = mainDb.collections.educations;
		this.requiredAttributes = { qualification, institution, startDate, userBiography: biographyId };
	}

	/**
	 * Set the attributes for the Education Collection
	 * @param {Education} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}

	/**
	 * Uploads the document into Storage then proceeds to create a Record in the Educations collection
	 *
	 * @param {File} file
	 * @param {Education|Object} data
	 * @returns
	 */
	async createUpload(file, data = {}) {
		const storage = new StorageService();

		return storage
			.create('certificates', file)
			.then((res) => {
				if ('file' in res) this.create({ certificateSID: res.file.$id, ...this.data, ...data });
			})
			.catch((err) => handleError(err));
	}
}

export class UserBiographyService extends DBService {
	/**
	 * @typedef {Object} Biography
	 * @property {string} [background] - Background information
	 * @property {string[]} [contributions] - Contributions
	 * @property {string[]} [strengths] - Strengths
	 * @property {string[]} [weaknesses] - Weaknesses
	 * @property {string[]} [accomplishments] - Accomplishments
	 * @property {string[]} [coreValues] - Core values
	 * @property {string} [aspirations] - Aspirations
	 * @property {string[]} [fieldsOfInterest] - Fields of interest
	 * @property {SiteReference[]} [siteReferences] - Site references
	 * @property {Education[] | string[]} [educations] - Education details
	 * @property {SignedReference[]} [signedReferences] - Signed references
	 * @property {workExperiences[]} [workExperiences] - Work experiences
	 * @property {UserProfile | string} [userProfile] - User profile
	 */

	/**@param {string} userId  */
	constructor(userId) {
		super();
		this.collectionId = mainDb.collections.userBiographies;
		this.requiredAttributes = { userProfile: userId };
	}

	/**
	 *	Sets the attributes within the User Biography Collection
	 * @param {Biography} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}
}

/**
 * @param {{ message: string;success:boolean;error:Object }} error
 */
function handleError(error) {
	return { success: false, errorMessage: error.message, error };
}

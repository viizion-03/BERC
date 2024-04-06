import { Query } from 'appwrite';
import { AuthService, mainDb, StorageService } from './appwrite';
import { DBService } from './DBService';

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

	constructor(event,omangPassport = '', firstname = '', surname = '', dob = '', nationality = '') {
		super(event);
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
	constructor(event,type, senderId, chatRoomId) {
		super(event);
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
	constructor(event,name = '') {
		super(event);
		this.collectionId = mainDb.collections.chatRooms;
		this.requiredAttributes = { name };
	}
}

export class ForumCommentService extends DBService {
	/**
	 * @typedef {object} ForumComment
	 * @property {String} comment - The comment. (required)
	 * @property {UserProfile} authorProfile - The author profile of the forum comment.
	 * @property {Forum} forum - The forum associated with the forum comment.
	 * @property {number} likes - The number of likes of the forum comment.
	 */

	constructor(event,comment='', forumId ='', commentorId ='') {
		super(event);
		this.collectionId = mainDb.collections.forumComments;
		this.requiredAttributes = {comment, authorProfile: commentorId, forum: forumId}
	}

	/**
	 * Sets the Forum Comments collection Attributes for the object
	 * @param {ForumComment |object} data 
	 */
	setData(data){
		this.data = {...this.data, ...data}
	}
	
	/**
	 *
	 * @param {string} forumCommentId Forum ID of post to be updated
	 */
	async addLike(forumCommentId) {
		const response = this.get(forumCommentId, [Query.select(['likes'])]).then((res) => {
			if ('doc' in res) {
				const likes = res.doc.likes + 1;
				return this.update(forumCommentId, { likes });
			}
		});

		return response;
	}

	/**
	 * Reduces the Like count by 1
	 *
	 * @param {string} forumCommentId Forum ID of post to be updated
	 */
	async removeLike(forumCommentId) {
		const response = this.get(forumCommentId, [Query.select(['likes'])]).then((res) => {
			if ('doc' in res) {
				const likes = res.doc.likes + 1;
				return this.update(forumCommentId, { likes });
			}
		});

		return response;
	}
}

export class ForumService extends DBService {
	/**
	 * @typedef {object} Forum
	 * @property {String} title - The title of the forum. (required)
	 * @property {String} body - The body of the forum. (required)
	 * @property {String[]} tags - The tags of the forum.
	 * @property {string[]} mediaSIDs - The media SIDs of the forum.
	 * @property {number} likes - The number of likes of the forum.
	 * @property {ForumComment[]} forumComments - The forum comments of the forum.
	 * @property {UserProfile} authorProfile - The author profile of the forum.
	 */

	constructor(event,title = '', body = '', authorId = '') {
		super(event);
		this.collectionId = mainDb.collections.forums;
		this.requiredAttributes = { title, body, authorProfile: authorId };
	}

	/**
	 * Configures the Forum collection attributes for the object
	 * @param {Forum| object} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}

	/**
	 *
	 * @param {string} forumId Forum ID of post to be updated
	 */
	async addLike(forumId) {
		const response = this.get(forumId, [Query.select(['likes'])]).then((res) => {
			if ('doc' in res) {
				const likes = res.doc.likes + 1;
				return this.update(forumId, { likes });
			}
		});

		return response;
	}

	/**
	 * Reduces the Like count by 1
	 *
	 * @param {string} forumId Forum ID of post to be updated
	 */
	async removeLike(forumId) {
		const response = this.get(forumId, [Query.select(['likes'])]).then((res) => {
			if ('doc' in res) {
				const likes = res.doc.likes + 1;
				return this.update(forumId, { likes });
			}
		});

		return response;
	}

	/**
	 *
	 * @param {FileList} files Files to be uploaded on the forum post
	 * @param {string} forumId Unique ID of the forum post
	 */
	async createWithMedia(files, forumId) {
		const storage = new StorageService();
		this.create().then(async (res) => {
			if ('doc' in res) {
				/**
				 * @type {string[]}
				 */
				const fileSIDs = [];
				/**
				 * @type {{ file: File; error: any; }[]}
				 */
				const unUploaded = [];

				for (const file of files) {
					await storage.create('posts', file).then((res) => {
						if ('file' in res) {
							fileSIDs.push(res.file.$id);
						}

						if ('error' in res) {
							unUploaded.push({ file, error: res.error });
						}
					});
				}

				const existingImages = await this.get(forumId, [Query.select(['mediaSIDs'])]).then(
					(res) => {
						if ('doc' in res) {
							return res.doc.mediaSIDs;
						} else {
							return [];
						}
					}
				);
				this.setData({ mediaSIDs: [...existingImages, ...fileSIDs] });

				await this.update(forumId).then((res) => {
					if ('error' in res) {
						//TODO - Delete Media from Storage
						fileSIDs.forEach((id) => storage.delete('posts', id));
						return { ...res };
					}
				});

				if (unUploaded.length > 0) return { success: false, unUploaded };
				else return { success: true };
			}
		});
	}
}

export class VacancyNotificationService extends DBService {
	constructor(event) {
		super(event);
		this.collectionId = mainDb.collections.vacancyNotifications;
	}
}

export class ApplicantNoteService extends DBService {
	constructor(event) {
		super(event);
		this.collectionId = mainDb.collections.applicantnNotes;
	}
}

export class VacancyApplicationService extends DBService {
	constructor(event) {
		super(event);
		this.collectionId = mainDb.collections.vacancyApplications;
	}
}

export class VacancyService extends DBService {
	constructor(event) {
		super(event);
		this.collectionId = mainDb.collections.vacancies;
	}
}

export class NotificationService extends DBService {
	constructor(event) {
		super(event);
		this.collectionId = mainDb.collections.notifications;
	}
}

export class SocialMediaAccountService extends DBService {
	/**
	 * @typedef {object} SocialMediaAccount
	 * @property {String} platform - The  platform name of the social media account. (required)
	 * @property {'organization' | 'user'} ownerType - The owner type of the social media account. (required)
	 * @property {string} link - The link to the social media account. (required)
	 * @property {String} handle - The handle of the social media account.
	 * @property {UserProfile} userProfile - The user profile associated with the social media account.
	 * @property {Organization} organization - The organization associated with the social media account.
	 */

	/**@param {'organization'| 'user'|''} [ownerType=''] @param {string} profileId   */
	constructor(event,platform = '', ownerType = '', link = '', profileId = '') {
		super(event);
		this.collectionId = mainDb.collections.socialMediaAccounts;
		if (ownerType === 'organization') this.requiredAttributes = { organization: profileId };
		else if (ownerType === 'user') this.requiredAttributes = { userProfile: profileId };
		this.requiredAttributes = { ...this.requiredAttributes, platform, ownerType, link };
	}

	/**
	 * Sets the attributes of the social media accounts collection for the object
	 * @param {SocialMediaAccount| object} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}
}

export class OrganizationService extends DBService {
	/**
	 * @typedef {object} Organization
	 * @property {String} name - The name of the organization. (required)
	 * @property {String} location - The location of the organization. (required)
	 * @property {String} district - The district of the organization.
	 * @property {String} physicalAddress - The physical address of the organization.
	 * @property {String} postalAddress - The postal address of the organization. (required)
	 * @property {String} description - The description of the organization. (required)
	 * @property {number} yearFounded - The year the organization was founded.
	 * @property {String} coverImageSID - The cover image SID of the organization.
	 * @property {String} logoSID - The logo SID of the organization.
	 * @property {String} website - The website of the organization.
	 * @property {String} fax - The fax number of the organization.
	 * @property {string[]} contacts - The contacts of the organization.
	 * @property {String} mainEmail - The main email of the organization.
	 * @property {String[]} otherEmails - The other emails of the organization.
	 * @property {String[]} industryTags - The industry tags of the organization.
	 * @property {String} missionStatement - The mission statement of the organization.
	 * @property {String[]} mediaSIDs - The media SIDs of the organization.
	 * @property {String[]} certificationSIDs - The certification SIDs of the organization.
	 * @property {SocialMedia[]} socialMediaAccounts - The social media accounts of the organization.
	 * @property {UserProfile[] | string[]} managingUserProfiles - The managing user profiles of the organization.
	 * @property {Notification[] | string[]} notifications - The notifications of the organization.
	 */

	constructor(event,name = '', location = '', district = '', description = '', userId = '') {
		super(event);
		this.collectionId = mainDb.collections.organizations;
		this.requiredAttributes = {
			name,
			location,
			district,
			description,
			managingUserProfiles: [userId]
		};
	}

	/**
	 * Sets the values for the Organization collection attributes
	 * @param {Organization|object} data Key value pairs for the attributes the Organaization collection
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}

	/**
	 * Uploads an Cover Photo or Logo to storage then updates the Organization records
	 *
	 * @param {File} file Image to be Uploaded
	 * @param {'logo'|'coverPhoto'} type Enum of which type of Image to upload
	 * @param {string} organizationId Unique Identifier for the Organization Profile
	 * @returns
	 */
	async uploadImage(file, type, organizationId) {
		const storage = new StorageService();
		if (type === 'logo') {
			return storage.create('logos', file).then((res) => {
				if ('file' in res) this.setData({ logoSID: res.file.$id });
				return this.update(organizationId);
			});
		} else if (type === 'coverPhoto') {
			return storage.create('coverPhotos', file).then((res) => {
				if ('file' in res) this.setData({ coverImageSID: res.file.$id });
				return this.update(organizationId);
			});
		}
	}

	/**
	 *
	 * @param {FileList} files List of Media Files to be uploaded
	 * @param {string} organizationId Unique Identifyer for the Organization profile
	 * @param {'image'|'doc'} type The Type of Media being Uploaded between Pictures and Certifications
	 * @returns
	 */
	async uploadMedia(files, organizationId, type) {
		const storage = new StorageService();
		/**
		 * @type {string[]}
		 */
		const fileSIDs = [];
		/**
		 * @type {{ file: File; error: any; }[]}
		 */
		const unUploaded = [];

		for (const file of files) {
			await storage.create('profileMedia', file).then((res) => {
				if ('file' in res) {
					fileSIDs.push(res.file.$id);
				}

				if ('error' in res) {
					unUploaded.push({ file, error: res.error });
				}
			});
		}

		if (type === 'image') {
			const existingImages = await this.get(organizationId, [Query.select(['mediaSIDs'])]).then(
				(res) => {
					if ('doc' in res) {
						return res.doc.mediaSIDs;
					} else {
						return [];
					}
				}
			);
			this.setData({ mediaSIDs: [...existingImages, ...fileSIDs] });
		} else if (type === 'doc') {
			const existingDocs = await this.get(organizationId, [
				Query.select(['certificationSIDs'])
			]).then((res) => {
				if ('doc' in res) {
					return res.doc.certificationSIDs;
				} else {
					return [];
				}
			});
			this.setData({ certificationSIDs: [...existingDocs, ...fileSIDs] });
		}

		await this.update(organizationId).then((res) => {
			if ('error' in res) {
				//TODO - Delete Media from Storage
				fileSIDs.forEach((id) => storage.delete('profileMedia', id));
				return { ...res };
			}
		});

		if (unUploaded.length > 0) return { success: false, unUploaded };
		else return { success: true };
	}
}

export class UserLanguageService extends DBService {
	/**
	 * @typedef {object} Language
	 * @property {string} language - The language. (required)
	 * @property {'Beginner' | 'Intermediate' | 'Fluent' | 'Native'} proficiency - The proficiency level. (required)
	 * @property {number} years - The number of years of experience.
	 * @property {UserProfile|string} userProfile - The user profile. (required)
	 */

	/** @param {'Beginner' | 'Intermediate' | 'Fluent' | 'Native' | ''} proficiency - The proficiency level. (required) */
	constructor(event,language = '', proficiency = '', userId = '') {
		super(event);
		this.collectionId = mainDb.collections.userLanguages;
		this.requiredAttributes = { language, proficiency, userProfile: userId };
	}

	/**
	 * Sets the Object's Attributes for the Language collection
	 * @param {Language|object} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}
}

export class WorkExperienceService extends DBService {
	/**
	 * @typedef {Object} WorkExperience
	 * @property {string} occupation - The occupation (required)
	 * @property {string} [organization] - The organization
	 * @property {Date} startDate - The start date (required)
	 * @property {Date} [endDate] - The end date
	 * @property {string[]} [achievements] - The achievements
	 * @property {string[]} [skillsAcquired] - The skills acquired
	 * @property {SiteReference[] | string[]} siteReferences - The site references associated with this work experience
	 * @property {SignedReference[] | string[]} signedReferences - The signed references associated with this work experience
	 * @property {Biography | string} userBiography - The user biography associated with this work experience
	 */

	constructor(event,occupation = '', startDate = '', userBiography = '') {
		super(event);
		this.collectionId = mainDb.collections.workExperiences;
		this.requiredAttributes = { occupation, startDate, userBiography };
	}

	/**
	 * Sets the object's attributes in relation to the WorkExperices Collection
	 *
	 * @param {WorkExperience|object} data Key values pairs of collection attributes and their values
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}
}

export class ProjectService extends DBService {
	/**
	 * @typedef {object} Project
	 * @property {String} title - The title of the project. (required)
	 * @property {String} summary - The summary of the project. (required)
	 * @property {String} description - The description of the project.
	 * @property {String[]} imageSIDs - The image IDs associated with the project.
	 * @property {String[]} attachmentSIDs - The attachment IDs associated with the project.
	 * @property {string[]} websites - The websites associated with the project.
	 * @property {string} creatorUID - The User ID of whoever first uploaded the project (required)
	 * @property {UserProfile[] | string[]} userProfiles - The user profiles associated with the project.
	 */

	constructor(event,title = '', summary = '', userId = '') {
		super(event);
		this.collectionId = mainDb.collections.projects;
		this.requiredAttributes = { title, summary, creatorUID: userId, userProfiles: [userId] };
	}

	/**
	 * Set the objects' Project collection attributes
	 * @param {Project | Object} data
	 */
	setData(data) {
		this.data = { ...this.data, ...data };
	}

	/**
	 *
	 * @param {FileList} files Array of files to be uploaded
	 * @param {string} projectId Unique Identifier for the project
	 * @param {'image'|'attachment'} type Type of
	 *
	 */
	async uploadMedia(files, projectId, type) {
		const storage = new StorageService();
		/**
		 * @type {string[]}
		 */
		const fileSIDs = [];
		/**
		 * @type {{ file: File; error: any; }[]}
		 */
		const unUploaded = [];

		for (const file of files) {
			await storage.create('projects', file).then((res) => {
				if ('file' in res) {
					fileSIDs.push(res.file.$id);
				}

				if ('error' in res) {
					unUploaded.push({ file, error: res.error });
				}
			});
		}

		if (type === 'image') {
			this.setData({ imageSIDs: fileSIDs });
		} else if (type === 'attachment') {
			this.setData({ attachmentSIDs: fileSIDs });
		}
		await this.update(projectId).then((res) => {
			if ('error' in res) {
				//TODO - Delete Uploaded files from Storage
				fileSIDs.forEach((id) => storage.delete('projects', id));
				return { ...res };
			}
		});

		if (unUploaded.length > 0) return { success: false, unUploaded };
		else return { success: true };
	}
}

export class SignedReferenceService extends DBService {
	/**
	 * @typedef {Object} SignedReference
	 * @property {string} docsID - The document ID (required)
	 * @property {string} authorFullname - The author's full name (required)
	 * @property {string[]} [authorContacts] - The author's contacts
	 * @property {WorkExperience | string} workExperience - The work experience associated with this signed reference
	 * @property {Biography | string} userBiography - The biography to which this reference is for
	 */

	constructor(event,authorFullname = '', userBiography = '') {
		super(event);
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
		} else {
			return { ...uploadedFile };
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
	 * @property {WorkExperience | string} workExperience - The work experience associated with this site reference
	 * @property {UserProfile | string} authorProfile - The Account that created the site reference
	 * @property {Biography | string} userBiography - The Biography for the accout to which the reference belongs to
	 */

	// /**@type {SiteReference | undefined} */
	// data;
	constructor(event,relationshipToCandidate = '', summary = '', authorProfile = '', userBiography = '') {
		super(event);
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

	constructor(event,qualification = '', institution = '', startDate = '', biographyId = '') {
		super(event);
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
	 * @property {SiteReference[] | string[]} [siteReferences] - Site references
	 * @property {Education[] | string[]} [educations] - Education details
	 * @property {SignedReference[] | string[]} [signedReferences] - Signed references
	 * @property {WorkExperience[] | string[]} [workExperiences] - Work experiences
	 * @property {UserProfile | string} [userProfile] - User profile
	 */

	/**@param {string} userId  */
	constructor(event,userId) {
		super(event);
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

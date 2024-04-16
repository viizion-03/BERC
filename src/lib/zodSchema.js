import { z } from 'zod';
const requiredMessage = `field is required and cannot be empty`;

export const vacancySchema = z
	.object({
		profileType: z.string(),
		jobTitle: z.string().min(1, requiredMessage),
		location: z.string().min(1, requiredMessage),
		district: z.string().min(1, requiredMessage),
		isFulltime: z.boolean().default(true),
		industryTags: z.array(z.string().min(1, requiredMessage)),
		requirements: z.array(z.string()),
		yearsOfExperience: z.number().min(0).max(70).default(0),
		jobDescription: z.string().min(1, requiredMessage),
		deadline: z.string(),
		salary: z.number().min(0),
		supportEmail: z.string(),
		responsibilities: z.array(z.string()),
		otherInfo: z.string().optional(),
		userProfile: z.string().default(''),
		organization: z.string().default('')
	})
	.refine(({ deadline }) => new Date(deadline) > new Date(), {
		message: 'Deadline  should be in the future',
		path: ['deadline']
	});

const userLanguageSchema = z.object({
	language: z.string(),
	proficiency: z.string(),
	years: z.number()
});

export const educationSchema = z
	.object({
		qualification: z.string().min(1, requiredMessage),
		institution: z.string().min(1, requiredMessage),
		startDate: z.string().min(1, requiredMessage),
		endDate: z.string().optional(),
		isSuccessfullyCompleted: z.boolean().optional(),
		certificateSID: z.string().optional(),
		userBiography: z.string()
	})
	.refine(
		({ startDate, endDate }) => {
			if (endDate) return new Date(endDate) > new Date(startDate);
			else return true;
		},
		{
			message: 'End date cannot be earlier than the start date',
			path: ['endDate']
		}
	);

export const workExperienceSchema = z
	.object({
		occupation: z.string().min(1, requiredMessage),
		organization: z.string(),
		startDate: z.string().min(1, requiredMessage),
		endDate: z.string().optional(),
		achievments: z.array(z.string()),
		skillsAquired: z.array(z.string()),
		userBiography: z.string()
	})
	.refine(
		({ startDate, endDate }) => {
			if (endDate) return new Date(endDate) > new Date(startDate);
			else return true;
		},
		{
			message: 'End date cannot be earlier than the start date',
			path: ['endDate']
		}
	);

const siteReferenceSchema = z.object({
	relationshipToCandistring: z.string(),
	candistringExperience: z.any().optional(),
	candistringCapabilities: z.array(z.string()),
	impactCreated: z.any().optional(),
	personalQualities: z.array(z.string()),
	potential: z.string(),
	summary: z.string(),
	otherInformation: z.any().optional()
});

const signedReferenceSchema = z.object({
	docSID: z.string(),
	authorFullname: z.string(),
	authorContacts: z.array(z.string())
});

const userBiographySchema = z.object({
	background: z.string(),
	contributions: z.array(z.string()),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	accomplishments: z.array(z.string()),
	coreValues: z.array(z.string()),
	aspirations: z.any().optional(),
	fieldsOfInterest: z.array(z.string()),
	educations: z.array(educationSchema),
	workExperiences: z.array(workExperienceSchema),
	siteReferences: z.array(siteReferenceSchema),
	signedReferences: z.array(signedReferenceSchema)
});

export const profileSchema = z.object({
	omangPassport: z.string(),
	firstname: z.string(),
	middleNames: z.array(z.string()),
	dob: z.string(),
	sex: z.string().optional(),
	nationality: z.string(),
	contacts: z.array(z.string().regex(/^\+[0-9]+$/)),
	emails: z.array(z.string()),
	Occupation: z.string().optional(),
	currentCompany: z.string().optional(),
	location: z.string().optional(),
	district: z.string().optional(),
	physicalAddress: z.string().optional(),
	highlights: z.any().optional(),
	isVerified: z.boolean(),
	avatarSID: z.string(),
	introAudioSID: z.string().optional(),
	coverPhotoSID: z.string().optional(),
	surname: z.string(),
	userBiography: userBiographySchema,
	projects: z.array(z.string()),
	userLanguages: z.array(userLanguageSchema),
	socialMediaAccounts: z.array(z.string()),
	organizations: z.array(z.string()),
	notifications: z.array(z.string()),
	vacancyApplications: z.array(z.string()),
	applicantNotes: z.array(z.string()),
	forumComments: z.array(z.string()),
	forums: z.array(z.string()),
	siteReferences: z.array(z.string()),
	myVacancies: z.array(z.string())
});

const socialMediaAccountSchema = z.object({
	platform: z.string(),
	ownerType: z.string(),
	link: z.string(),
	handle: z.string().optional(),
	organization: z.string().optional()
});

// For Later
const applicantNoteSchema = z.object({});
const organizationSchema = z.object({
	name: z.string(),
	location: z.string(),
	district: z.string(),
	physicalAddress: z.string().optional(),
	postalAddress: z.string().optional(),
	description: z.string(),
	yearFounded: z.number().optional(),
	coverImageSID: z.string(),
	logoSID: z.string(),
	website: z.string().optional(),
	fax: z.string().optional(),
	contacts: z.array(z.string()),
	mainEmail: z.string().optional(),
	otherEmails: z.array(z.string()),
	industryTags: z.array(z.string()),
	missionStatement: z.string().optional(),
	mediaSIDs: z.array(z.string()),
	certificationSIDs: z.array(z.string()),
	socialMediaAccounts: z.array(z.string()),
	notifications: z.array(z.any()),
	vacancies: z.array(z.any())
});

const projectSchema = z.object({
	title: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
	imageSIDs: z.array(z.string()),
	attachmentSIDs: z.array(z.string()),
	websites: z.array(z.string()),
	creatorUID: z.string()
});

const forumCommentSchema = z.object({
	comment: z.string(),
	likes: z.number(),
	forum: z.any()
});

const forumSchema = z.object({
	title: z.string(),
	body: z.string(),
	tags: z.array(z.string()),
	likes: z.number(),
	mediaSIDs: z.array(z.string()),
	forumComments: z.array(z.string())
});

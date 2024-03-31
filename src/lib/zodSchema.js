import { z } from 'zod';
const requiredMessage = 'field is required and cannot be empty';

export const vacancySchema = z.object({
	profileType: z.string(),
	jobTitle: z.string().min(1, requiredMessage),
	location: z.string().min(1, requiredMessage),
	district: z.string().min(1, requiredMessage),
	isFulltime: z.boolean().default(true),
	industryTags: z.array(z.string().min(1, requiredMessage)),
	requirements: z.array(z.string()),
	yearsOfExperience: z.number().min(0).max(70).default(0),
	jobDescription: z.string().min(1, requiredMessage),
	deadline: z.date(),
	salary: z.number().min(0),
	supportEmail: z.string(),
	responsibilities: z.array(z.string()),
	otherInfo: z.string().optional()
});

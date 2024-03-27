import { VacancyNotificationService, VacancyService } from '$lib/services/backend-services';
import { Query } from 'appwrite';

export async function load() {
	async function getVacancies() {
		return new VacancyService().list()
	}

	return {
		vacancies: getVacancies()
	};
}

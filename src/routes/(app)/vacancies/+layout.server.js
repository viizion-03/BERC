import { VacancyService } from "$lib/services/backend-services"

// @ts-ignore
export const load = async () => {

    function getVacancies(){
        return new VacancyService().list()
    }

    return {
        vacancies: getVacancies()
    }
}
import { VacancyService } from "$lib/services/backend-services"

export const load = async() => {
    function getVacancies(){
        return new VacancyService().list()
    }

    return {
        vacancies: getVacancies()
    }
}
import { VacancyService } from "$lib/services/backend-services"
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { vacancySchema } from "$lib/zodSchema";




// @ts-ignore
export const load = async () => {

    const newVacancyForm = await superValidate(zod(vacancySchema))


    function getVacancies(){
        return new VacancyService().list()
    }

    return {
        vacancies: getVacancies(),
        newVacancyForm
    }
}
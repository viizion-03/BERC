import { VacancyService } from "$lib/services/backend-services"
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { vacancySchema } from "$lib/zodSchema";




// @ts-ignore
export const load = async (event) => {

    const newVacancyForm = await superValidate(zod(vacancySchema))


    function getVacancies(){
        return new VacancyService(event).list()
    }

    return {
        vacancies: getVacancies(),
        newVacancyForm
    }
}
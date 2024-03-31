import { superValidate } from 'sveltekit-superforms'
import { vacancySchema } from '$lib/zodSchema.js'
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const actions = {
    create: async ({request}) => {
        const form = await superValidate(request, zod(vacancySchema))
        console.log(form)
        
        if(!form.valid){
            return fail(400, {form})
        }
    }
}
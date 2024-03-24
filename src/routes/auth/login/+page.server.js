
import { z } from 'zod';
import { superValidate,message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {fail} from '@sveltejs/kit'

const loginSchema = z.object({
	email: z.string().email().min(1).trim(),
	password: z.string().min(8, 'Password must be have 8 or more characters').trim(),
	rememberMe: z.boolean(),
});

export const load = async (event) => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(loginSchema));
        console.log(form)

        if(!form.valid){
            return fail(400,{form})
        }

        return message(form, 'Log in Successful');
        // return {form}
	}
};

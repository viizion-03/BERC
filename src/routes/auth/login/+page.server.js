export const actions = {
    default: async({request, cookies}) => {
        const formData = Object.fromEntries( await request.formData());
        console.log(formData)
    },
}
import { SESSION_COOKIE, createSessionClient } from "$lib/services/appwrite-auth.js"
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {

  // @ts-ignore
  if (!locals.user) redirect(301, "/auth/login");

  return {
    // @ts-ignore
    user: locals.user,
  };
}

export const actions = {
  logout: async (event) => {
    const { account } = createSessionClient(event);

    await account.deleteSession("current");
    event.cookies.delete(SESSION_COOKIE, { path: "/" });

    redirect(301, "/auth/login");
  },
};
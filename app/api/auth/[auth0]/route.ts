import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

export const GET = handleAuth({
  async login(req: NextApiRequest, res: any) {
    const params = new URL(req.url || "").searchParams;
<<<<<<< HEAD
    const inviteCode = params.get("inviteCode");
    const useSignUp = params.get("useSignUp");
=======
    const inviteCode = params.get('inviteCode');
>>>>>>> main

    try {
      return handleLogin(req, res, {
        authorizationParams: {
          inviteCode: inviteCode || undefined,
<<<<<<< HEAD
          screen_hint: useSignUp === "true" ? "signup" : "login",
=======
>>>>>>> main
        },
        returnTo: "/",
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  },
});

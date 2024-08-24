import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

export const GET = handleAuth({
  async login(req: NextApiRequest, res: any) {
    const params = new URL(req.url || "").searchParams;
    const inviteCode = params.get("inviteCode");
    const useSignUp = params.get("useSignUp");

    try {
      return handleLogin(req, res, {
        authorizationParams: {
          inviteCode: inviteCode || undefined,
          screen_hint: useSignUp === "true" ? "signup" : "login",
        },
        returnTo: "/manager",
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  },
});

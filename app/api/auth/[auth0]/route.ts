import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

export const GET = handleAuth({
  async login(req: NextApiRequest, res: any) {
    const params = new URL(req.url || "").searchParams;
    const inviteCode = params.get('inviteCode');

    try {
      return handleLogin(req, res, {
        authorizationParams: {
          inviteCode: inviteCode || undefined,
        },
        returnTo: "/",
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  },
});

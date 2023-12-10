import { getSession } from "@auth0/nextjs-auth0";
import moment from "moment";
import { redirect } from "next/navigation";

moment.locale('es');

export default async function Home() {
  const session = await getSession();

  if (!session) return <a href="/api/auth/login">Login</a>;

  return redirect("/manager");
}

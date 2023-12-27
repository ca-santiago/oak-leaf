import { getSession } from "@auth0/nextjs-auth0";
import moment from "moment";
import { redirect } from "next/navigation";

moment.locale("es");

export default async function Home() {
  const session = await getSession();

  if (!session)
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <div className="flex flex-col">
          <h2 className="text-center font-semibold text-2xl text-slate-700">
            Welcome to Habits app
          </h2>
          <p className="text-slate-500">
            Developed by Carmen Santiago at casantiago.com
          </p>
        </div>
        <a
          className="p-2 rounded-md bg-blue-500 text-white font-semibold mt-8"
          href="/api/auth/login"
        >
          Login
        </a>
      </div>
    );

  return redirect("/manager");
}

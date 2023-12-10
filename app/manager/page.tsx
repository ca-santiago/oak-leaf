import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import { getHabits, getHabitsV2 } from "./getHabits";
import { Habits, HabitsIncidences } from "./habit";

const LogOut = () => (
  <a
    href="/api/auth/logout"
    className="p-2 px-3 rounded-md bg-red-500 text-white"
  >
    Logout
  </a>
);

import Image from "next/image";

async function ManagerPage() {
  const session = await getSession();
  const { user, accessToken } = session!;
  const { name, picture, sub } = user;

  // const res = await getProfileData(sub);
  const habits = await getHabitsV2(accessToken!, "2023");

  // console.log(session);
  // console.log(habits);

  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      <div className="w-full p-2 px-3 shadow bg-white flex flex-row items-center gap-3 justify-between">
        <div className="flex gap-2 items-center">
          <div className="rounded-md overflow-hidden">
            <Image src={picture} alt="yo" height={40} width={40} priority />
          </div>
          <div className="font-semibold text-sm text-slate-700">
            {name || ""}
          </div>
        </div>
        <LogOut />
      </div>
      <section id="habits-section" className="w-full lg:w-2/3 bg-blue-50">
        <HabitsIncidences data={habits} token={accessToken!} />
      </section>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

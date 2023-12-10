import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import { getHabits, getHabitsV2 } from "./getHabits";
import { Habits, HabitsIncidences } from "./habit";

import Image from "next/image";

async function ManagerPage() {
  const session = await getSession();
  const { user, accessToken } = session!;
  const { name, picture, sub } = user;

  // const res = await getProfileData(sub);
  const habits = await getHabitsV2(accessToken!, "2023");

  // console.log(session);
  console.log(habits);

  return (
    <div className="bg-[#f4f6f9]">
      <div>Hello {name || ""}</div>
      <Image src={picture} alt="yo" height={100} width={100} priority />
      <a href="/api/auth/logout">Logout</a>
      <section id="habits-section" className="w-1/3 max-w-6xl bg-blue-50">
        <HabitsIncidences data={habits} token={accessToken!} />
        {/* <Habits token={accessToken!} data={habits.data} /> */}
      </section>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

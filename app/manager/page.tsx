import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { getProfileData } from "./getProfileData";
import { getHabits } from "./getHabits";
import { Habits } from "./habit";

async function ManagerPage() {
  const session = await getSession();
  const {
    user: { name, picture, sub },
    accessToken,
  } = session!;
  const res = await getProfileData(sub);
  const habits = await getHabits(accessToken!);

  const displayName = res?.preferredName || name || "";

  return (
    <div>
      {displayName && <div>Hello {displayName}</div>}
      <Image src={picture} alt="yo" height={100} width={100} priority />
      <a href="/api/auth/logout">Logout</a>
      <div>Habits?</div>
      <section id="habits-section">
        <Habits token={accessToken!} data={habits.data} />
      </section>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/" });

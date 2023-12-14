import { getHabits } from "@/services/habits";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habitsList";
import { AccountHeader } from "@/components/accountHeader";
import { VERSION } from "@/core/constants";
import { VersionLabel } from "@/components/versionLabel";

async function ManagerPage() {
  const session = await getSession();
  const { user, accessToken } = session!;
  const { name, picture, sub } = user;

  // const res = await getProfileData(sub);
  const habits = await getHabits(accessToken!, "2023");

  // console.log(session);
  // console.log(habits);

  return (
    <div className="bg-[#ebeff4] min-h-screen">
      <AccountHeader session={session!} />
      <HabitsList data={habits} token={accessToken!} />
      <VersionLabel />
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

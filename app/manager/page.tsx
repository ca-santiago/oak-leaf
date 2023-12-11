import { getHabits } from "@/services/habits";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "./habitsList";
import { AccountHeader } from "@/components/accountHeader";
import { VERSION } from "@/core/constants";

async function ManagerPage() {
  const session = await getSession();
  const { user, accessToken } = session!;
  const { name, picture, sub } = user;

  // const res = await getProfileData(sub);
  const habits = await getHabits(accessToken!, "2023");

  // console.log(session);
  // console.log(habits);

  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      <AccountHeader session={session!} />
      <HabitsList data={habits} token={accessToken!} />
      <div className="fixed bottom-3 right-4">v{VERSION}</div>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

import { getHabits } from "@/services/habits";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habitsList";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountInfo } from "@/services/accounts";

async function ManagerPage() {
  const session = await getSession();
  const { accessToken } = session!;

  // const res = await getProfileData(sub);
  const habits = await getHabits(accessToken!, "2023");
  const accountConfig = await getAccountInfo(accessToken!);

  // console.log(session);
  // console.log(habits);
  // console.log(accountConfig);

  return (
    <div className="bg-[#ebeff4] min-h-screen">
      <AccountHeader session={session!} />
      <HabitsList account={accountConfig} data={habits} token={accessToken!} />
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

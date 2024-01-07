import { getHabits } from "@/services/habits";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habits/list";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountInfo } from "@/services/accounts";
import { ManagerContextWrapper } from "./context";

async function ManagerPage() {
  const session = await getSession();
  const { accessToken } = session!;

  const [habits, account] = await Promise.all([
    getHabits(accessToken!),
    getAccountInfo(accessToken!),
  ]);

  // console.log(session);
  // console.log(habits);
  // console.log(accountConfig);

  return (
    <div className="bg-[#ebeff4] min-h-screen">
      <AccountHeader session={session!} />
      <ManagerContextWrapper
        account={account}
        habits={habits}
        token={accessToken!}
      >
        <HabitsList />
      </ManagerContextWrapper>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

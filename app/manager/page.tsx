import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habits/list";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountData } from "@/services/accounts";
import { ManagerContextWrapper } from "./context";
import { redirect } from "next/navigation";
import { getAllHabits } from "@/services/habits";

async function ManagerPage() {
  const session = await getSession();
  const { accessToken, user } = session!;

  const account = await getAccountData({ userId: user.sub });

  if (!account) return redirect('/account-creation-fallback');

  const habits = await getAllHabits({ userId: account.id });

  // console.log({
  //   account,
  //   habits,
  // });

  return (
    <div className="bg-[#ebeff4] min-h-screen">
      <AccountHeader session={session!} />
      <ManagerContextWrapper
        account={account}
        habits={habits}
        token={accessToken!}
      >
        <div className="w-full md:w-5/6 lg:w-3/4 xl:w-1/2 mx-auto mt-6 pb-10 px-3 md:px-0 gap-12">
          <HabitsList />
        </div>
      </ManagerContextWrapper>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

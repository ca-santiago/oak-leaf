import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habits/list";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountData } from "@/services/accounts";
import { ManagerContextWrapper } from "./context";
import { redirect } from "next/navigation";
import { getAllHabits } from "@/services/habits";
import HabitsDaySchedule from "@/components/habits/day-schedule";

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
        <div className="grid row-auto grid-cols-8 h-full w-full flex-1 pt-8 px-8 gap-8">
          <div className="col-span-2 col-start-3">
            <HabitsDaySchedule />
          </div>
          <div className="col-span-2 col-start-5">
            <h3 className="text-slate-700 font-semibold text-xl text-center">Observa tu progreso</h3>
            <div className="mt-2">
              <HabitsList />
            </div>
          </div>
        </div>
      </ManagerContextWrapper>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

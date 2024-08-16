import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { HabitsList } from "../../components/habits/list";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountData } from "@/services/accounts";
import { ManagerContextWrapper } from "./context";
import { redirect } from "next/navigation";
import { getAllHabits } from "@/services/habits";
import HabitsDaySchedule from "@/components/habits/day-schedule";
import { HabitsContextProvider } from "@/context/habits";

async function ManagerPage() {
  const session = await getSession();
  const { accessToken, user } = session!;

  const account = await getAccountData({ userId: user.sub });

  if (!account) return redirect('/account-creation-fallback');

  const habits = await getAllHabits({ userId: account.id });

  return (
    <div className="bg-[#ebeff4] min-h-screen">
      <HabitsContextProvider habits={ habits }>
        <AccountHeader session={session!} />
        <ManagerContextWrapper
          account={account}
          habits={habits}
          token={accessToken!}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 2xl:grid-cols-12 h-full w-full flex-1 pt-6 lg:pt-8 px-2 lg:px-8 gap-6 md:gap-4 lg:gap-8">
            <div className="col-span-1 row-span-1 xl:col-start-2 xl:col-span-3 2xl:col-start-4">
              <HabitsDaySchedule />
            </div>
            <div className="col-span-1 row-span-1 xl:col-start-5 xl:col-span-3 2xl:col-start-7">
              <h3 className="text-slate-700 font-semibold text-xl text-center">Observa tu progreso</h3>
              <div className="mt-2">
                <HabitsList />
              </div>
            </div>
          </div>
        </ManagerContextWrapper>
      </HabitsContextProvider>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/manager" });

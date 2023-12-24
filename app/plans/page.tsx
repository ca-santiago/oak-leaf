import { PLANS, extendedPlanDefs } from "@/core/constants";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PlanCard } from "./planCard";
import { getAccountInfo } from "@/services/accounts";
import { Account } from "@/core/types";

const _plans = Object.values(PLANS);

async function PlansPage() {
  const session = await getSession();
  let account: Account;
  if (session?.accessToken) {
    account = await getAccountInfo(session.accessToken);
  }

  return (
    <div className="min-h-screen bg-lightblue pt-10 md:pt-32">
      <div className="mx-auto flex justify-center items-center">
        <div className="w-full md:w-2/3 lg:w-1/3 mx-3 md:mx-0">
          <h1 className="text-5xl font-semibold text-slate-800 text-center">
            {/* Get the best plan to beat your goals */}
            Our plans, your growth story.
          </h1>
          {/* <p className="text-slate-500 text-xl mt-3 text-center">
            Maximize your goals! Track habits, crunch metrics.
          </p> */}
          <p className="text-gray-500 font-semibold text-xl mt-5 text-center">
            {/* Hello, goal crusher!  */}
            Unlock your potential with our customized plans. Smash those goals,
            choose your winning formula, and pave the way to your triumph!
          </p>
        </div>
      </div>
      <div className="px-5 md:mx-auto w-full lg:w-2/3 mt-14 md:mt-24 xl:w-3/5 flex flex-col md:flex-row gap-5">
        {_plans.map((plan) => (
          <PlanCard
            plan={extendedPlanDefs[plan.type]}
            key={plan.type}
            currentPlan={account ? plan.type === 'total' : false}
          />
        ))}
      </div>
    </div>
  );
}

export default withPageAuthRequired(PlansPage, { returnTo: "/plans" });

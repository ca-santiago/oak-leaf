import { PlanDetails } from "@/core/constants";

interface Props {
  plan: PlanDetails;
  currentPlan?: boolean;
}

export const PlanCard = ({ plan, currentPlan = false }: Props) => {
  const { cost, currency, title, description, maxHabits, type } = plan;
  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-md p-3 pt-2 relative overflow-hidden">
      <div className="absolute -right-[0px] -top-[14px]">
        <plan.icon.element size={plan.icon.size} color={plan.icon.color} />
      </div>
      <h1 className="text-2xl font-semibold text-slate-700">{title}</h1>
      <p className="text-slate-500 text-sm mt-3">{description}</p>
      <p className="text-slate-500">
        Cost: {currency} {cost}
      </p>
      <p className="text-slate-500">
        Max Habits: {maxHabits > 9999 ? "Unlimited" : maxHabits}
      </p>
      <div className="mt-5 w-full">
        <div className="mx-auto">
          {/* ABTN */}
          {currentPlan && (
            <div className="text-sm font-semibold text-blue-400 translate-y-2">
              Current plan
            </div>
          )}
          {plan.type !== "basic" && !currentPlan && (
            <button
              style={{ background: plan.color }}
              className="p-1 px-2 rounded text-white"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

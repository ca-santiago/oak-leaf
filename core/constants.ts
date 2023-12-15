const pjson = require('../package.json')
  ;
export const DATE_FORMAT = "YYYY-MM-DD";
export const VERSION = pjson.version;

type PlanType = "basic" | "advanced" | "total";

interface PlanDefinition {
  type: PlanType;
  maxHabits: number;
  currency: string;
  cost: number;
}

type Plans = {
  [key in PlanType]: PlanDefinition;
}

export const defaultPlan: PlanDefinition = {
  type: "basic",
  maxHabits: 4,
  cost: 0,
  currency: "USD",
}

export const PLANS: Record<string, PlanDefinition> = {
  basic: defaultPlan,
  advanced: {
    type: "advanced",
    maxHabits: 20,
    cost: 10,
    currency: "USD",
  },
  total: {
    type: "total",
    maxHabits: 99999,
    cost: 15,
    currency: "USD",
  }
}

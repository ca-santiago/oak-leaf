import { StringRegexOptions } from "joi";
import React from "react";
import { IconType } from "react-icons";
import { TbBadgeFilled } from "react-icons/tb";

const pjson = require("../package.json");
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
};

export const defaultPlan: PlanDefinition = {
  type: "basic",
  maxHabits: 4,
  cost: 0,
  currency: "USD",
};

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
  },
};

export interface PlanDetails extends PlanDefinition {
  title: string;
  description: string;
  color: string;
  icon: {
    color: string;
    element: IconType;
    size?: number;
  };
}

export const extendedPlanDefs: Record<PlanType, PlanDetails> = {
  advanced: {
    ...PLANS.advanced,
    title: "Advanced",
    description: "",
    color: "#8344c6",
    icon: {
      color: "#8344c6",
      element: TbBadgeFilled,
      size: 55,
    },
  },
  basic: {
    title: "Basic",
    description: "",
    ...PLANS.basic,
    color: "#0a83d7",
    icon: {
      color: "#0a83d7",
      element: TbBadgeFilled,
      size: 55,
    },
  },
  total: {
    ...PLANS.total,
    title: "Total",
    description: "",
    color: "#f4c31e",
    icon: {
      color: "#f4c31e",
      element: TbBadgeFilled,
      size: 55,
    },
  },
};

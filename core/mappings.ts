//
import { IconType } from "react-icons";
import { FaCode } from "react-icons/fa";
import { PiPlaceholderLight } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { CgGym } from "react-icons/cg";

export interface IconMapping {
  [key: string]: {
    Icon: IconType;
    size: number;
  };
  default: {
    Icon: IconType;
    size: number;
  };
}

export const IconMapping: IconMapping = {
  default: {
    Icon: PiPlaceholderLight,
    size: 16,
  },
  code: {
    Icon: FaCode,
    size: 18,
  },
  books: {
    Icon: FaBook,
    size: 16,
  },
  gymnastics: {
    Icon: MdOutlineSportsGymnastics,
    size: 20,
  },
  gym: {
    Icon: CgGym,
    size: 20,
  },
};

interface ColorsSchema {
  base: string;
  active: string;
  bg: string;
  hover: string;
  textOnBg: string;
}

type SystemColors = "RED" | "GREEN";

export interface ColorsMapping {
  [key: string]: ColorsSchema;
  default: ColorsSchema;
}

export const ColorsMapping: ColorsMapping = {
  default: {
    base: "#FFFFFF",
    active: "#000000",
    bg: "#FFFFFF",
    hover: "#000000",
    textOnBg: "#000000",
  },
  softRed: {
    base: "#f1c1c1",
    active: "#ce5c5c",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  green: {
    base: "#d7f4dd",
    active: "#6cc67e",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  purple: {
    base: "#e2c2ee",
    active: "#a749be",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  blue: {
    base: "#bccaf3",
    active: "#4375c7",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  cyan: {
    base: "#bde7e7",
    active: "#3cbebe",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
};

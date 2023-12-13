//
import { IconType } from "react-icons";
import { FaCode } from "react-icons/fa";
import { PiPlaceholderLight } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoSearch } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { LuChurch } from "react-icons/lu";
import { FiMeh } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FiMic } from "react-icons/fi";
import { FiPhoneCall } from "react-icons/fi";
import { BiBulb } from "react-icons/bi";
import { BiCycling } from "react-icons/bi";
import { BiSolidBatteryCharging } from "react-icons/bi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { TbLetterCase } from "react-icons/tb";
import { RiBoxingLine } from "react-icons/ri";
import { RiCalendarCheckFill } from "react-icons/ri";
import { RiCapsuleFill } from "react-icons/ri";
import { TbMoodSearch } from "react-icons/tb";

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
  secure: {
    Icon: VscWorkspaceTrusted,
    size: 20,
  },
  search: {
    Icon: IoSearch,
    size: 20,
  },
  write: {
    Icon: FaPen,
    size: 20,
  },
  mail: {
    Icon: IoMail,
    size: 20,
  },
  shoppingCart: {
    Icon: FiShoppingCart,
    size: 20,
  },
  church: {
    Icon: LuChurch,
    size: 20,
  },
  meh: {
    Icon: FiMeh,
    size: 20,
  },
  chat: {
    Icon: FiMessageCircle,
    size: 20,
  },
  mic: {
    Icon: FiMic,
    size: 20,
  },
  phoneCall: {
    Icon: FiPhoneCall,
    size: 20,
  },
  bulb: {
    Icon: BiBulb,
    size: 20,
  },
  cycling: {
    Icon: BiCycling,
    size: 20,
  },
  battery: {
    Icon: BiSolidBatteryCharging,
    size: 20,
  },
  briefCase: {
    Icon: BsFillBriefcaseFill,
    size: 20,
  },
  letterCase: {
    Icon: TbLetterCase,
    size: 20,
  },
  box: {
    Icon: RiBoxingLine,
    size: 20,
  },
  capsule: {
    Icon: RiCapsuleFill,
    size: 20,
  },
  calendar: {
    Icon: RiCalendarCheckFill,
    size: 20,
  },
  moodSearch: {
    Icon: TbMoodSearch,
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
    base: "#f5dcdc",
    active: "#ce5c5c",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  green: {
    base: "#e1f5e0",
    active: "#6cc67e",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  purple: {
    base: "#f3e0fa",
    active: "#a749be",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  blue: {
    base: "#dde7ff",
    active: "#4375c7",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  cyan: {
    base: "#d4f1f1",
    active: "#3cbebe",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  golden: {
    base: "#f1e9d3",
    active: "#bebe6c",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  yellow: {
    base: "#f4f3ca",
    active: "#eae62f",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  orange: {
    base: "#ffede0",
    active: "#ea912f",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  pink: {
    base: "#f5ddee",
    active: "#d57bbb",
    bg: "#882222",
    hover: "#000000",
    textOnBg: "#FFFFFF",
  },
  angelBlue: {
    base: "#d6e1f1",
    active: "#5c95e4",
    bg: "#006633",
    hover: "#014323",
    textOnBg: "#FFFFFF",
  },
  charcoal: {
    base: "#d6e1ed",
    // active: " #3e454b",
    active: "#373e45",
    bg: "#FFFFFF",
    hover: "#000000",
    textOnBg: "#000000",
  },
};

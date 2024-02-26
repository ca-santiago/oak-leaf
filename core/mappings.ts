import { IconType } from "react-icons";
import { PiPlaceholderLight, PiRecordFill, PiScrollFill, PiSoccerBallFill } from "react-icons/pi";
import { FaCode, FaBook, FaPen, FaAudioDescription, FaScroll, FaThermometerFull, FaPhotoVideo } from "react-icons/fa";
import { MdCameraRoll, MdOutlineSportsGymnastics, MdSportsBaseball, MdSportsEsports, MdSportsFootball, MdSportsTennis } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { VscGraphLine, VscWorkspaceTrusted } from "react-icons/vsc";
import { IoSearch, IoVideocam, IoMail, IoCamera, IoSpeedometer, IoCarSportSharp, IoMegaphoneSharp } from "react-icons/io5";
import {
  FiShoppingCart,
  FiMeh,
  FiMessageCircle,
  FiMic,
  FiPhoneCall,
} from "react-icons/fi";
import { LuChurch } from "react-icons/lu";
import { BiBulb, BiCycling, BiSolidBatteryCharging, BiSolidPaintRoll } from "react-icons/bi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { TbLetterCase, TbMoodSearch, TbScript } from "react-icons/tb";
import {
  RiAliensFill,
  RiBookMarkFill,
  RiBoxingLine,
  RiBracesFill,
  RiBrushFill,
  RiCalendarCheckFill,
  RiCapsuleFill,
  RiEqualizerLine,
} from "react-icons/ri";
import { GiTiedScroll } from "react-icons/gi";

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
  videoCam: {
    Icon: IoVideocam,
    size: 20,
  },
  record: {
    Icon: PiRecordFill,
    size: 20,
  },
  camera: {
    Icon: IoCamera,
    size: 20,
  },
  paintRoll: {
    Icon: BiSolidPaintRoll,
    size: 20,
  },
  cameraRoll: {
    Icon: MdCameraRoll,
    size: 20,
  },
  ad: {
    Icon: FaAudioDescription,
    size: 20,
  },
  scriptRoll: {
    Icon: FaScroll,
    size: 20,
  },
  thermometer: {
    Icon: FaThermometerFull,
    size: 20,
  },
  Speedometer: {
    Icon: IoSpeedometer,
    size: 20,
  },
  lineGraph: {
    Icon: VscGraphLine,
    size: 20,
  },
  PhotoAndVideo: {
    Icon: FaPhotoVideo,
    size: 20,
  },
  sportCar: {
    Icon: IoCarSportSharp,
    size: 20,
  },
  baseball: {
    Icon: MdSportsBaseball,
    size: 20,
  },
  ESports: {
    Icon: MdSportsEsports,
    size: 20,
  },
  tennis: {
    Icon: MdSportsTennis,
    size: 20,
  },
  football: {
    Icon: MdSportsFootball,
    size: 20,
  },
  soccer: {
    Icon: PiSoccerBallFill,
    size: 20,
  },
  alien: {
    Icon: RiAliensFill,
    size: 20,
  },
  bookWithMark: {
    Icon: RiBookMarkFill,
    size: 20,
  },
  braces: {
    Icon: RiBracesFill,
    size: 20,
  },
  brush: {
    Icon: RiBrushFill,
    size: 20,
  },
  equalizer: {
    Icon: RiEqualizerLine,
    size: 20,
  },
  scriptOutline: {
    Icon: TbScript,
    size: 20,
  },
  tiedScroll: {
    Icon: GiTiedScroll,
    size: 20,
  },
  scrollFill: {
    Icon: PiScrollFill,
    size: 20,
  },
  megaphone: {
    Icon: IoMegaphoneSharp,
    size: 20,
  }
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
    active: "#373e45",
    bg: "#FFFFFF",
    hover: "#000000",
    textOnBg: "#000000",
  },
  softenedGreen: {
    base: '#CBF783',
    active: "#9BCF53",
    bg: "#FFFFFF",
    hover: "#000000",
    textOnBg: "#000000",
  },
  verdePantanoso: {
    base: '#8AA6A3',
    active: '#10454F',
    bg: '#FFFFFF',
    hover: '#000000',
    textOnBg: '#000000',
  },
  contraste: {
    base: '#02735E',
    active: '#F27405',
    bg: '#FFFFFF',
    hover: '#000000',
    textOnBg: '#000000',
  }
};

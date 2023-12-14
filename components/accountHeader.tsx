import { Session } from "@auth0/nextjs-auth0";
import { LogOutBtn } from "./logoutBtn";
import Image from "next/image";
import Link from "next/link";

interface AccountHeaderProps {
  session: Session;
}

export const AccountHeader = ({ session }: AccountHeaderProps) => {
  const { picture, name } = session.user;
  return (
    <div className="w-full p-2 px-3 shadow bg-white flex flex-row items-center gap-3 justify-between">
      <div className="flex gap-2 items-center">
        <div className="rounded-md overflow-hidden">
          <Image src={picture} alt="yo" height={40} width={40} priority />
        </div>
        <Link href="/profile">
          <div className="font-semibold text-sm text-slate-700">{name}</div>
        </Link>
      </div>
      <LogOutBtn />
    </div>
  );
};

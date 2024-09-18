'use client';

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
    <div className="w-full shadow bg-white py-2">
      <div className="w-full px-2 md:px-4 lg:px-8 flex justify-between items-center">
        <div className="flex gap-2 items-center cursor-pointer max-md:hidden">
          <div className="h-full w-12">
            <Image
              alt="Logo"
              className="h-full w-full"
              height={ 48  }
              src="https://personel-public-files-e42.s3.amazonaws.com/uq94kq9o-habits-logo-transparent-f7833392-a61a-4bcb-8a8e-2e9ada6d8dca.png"
              width={ 48 }
            />
          </div>
          <span className="text-slate-700 font-semibold">Habitosca</span>
        </div>
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
    </div>
  );
};

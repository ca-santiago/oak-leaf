"use client";
import { AccountInvite } from "@/core/types";
import copy from "copy-to-clipboard";
import { MouseEvent } from "react";
import toast from "react-hot-toast";

import { CgSoftwareUpload } from "react-icons/cg";

interface Props {
  accountInvite: AccountInvite;
}

export const UserInviteCode = ({ accountInvite }: Props) => {
  const handleCopyClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    copy(`${window.location.origin}/accept-invite/${accountInvite.id}`);
    toast.success("Invite code copied!");
  };

  return (
    <div className="w-full flex items-center justify-center select-none">
      <div
        className="p-2 px-3 w-fit bg-white shadow-sm rounded text-slate-800 flex gap-2 items-center justify-center cursor-pointer"
        onClick={handleCopyClick}
      >
        <CgSoftwareUpload />
        Share invite link
      </div>
    </div>
  );
};

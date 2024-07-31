import { Account } from "@/core/types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

interface AccountDetailsProps {
  data: Account;
}

export const AccountDetails = ({ data }: AccountDetailsProps) => {
  return (
    <div className="mt-2 flex flex-col items-center">
      { data.imageUri &&
        <div>
          <Image
            className="rounded-full"
            width={100}
            height={100}
            blurDataURL="true"
            alt="profile picture"
            draggable={false}
            src={data.imageUri}
          />
        </div>
      }
      <h1 className="font-semibold text-slate-700 text-lg mt-2">
        {data.preferredName}
      </h1>
      <div className="flex flex-col gap-2 mt-10">
        <p className="text-slate-700 text-sm">{data.contactEmail}</p>
        <p className="text-slate-700 text-sm">
          Member since: {moment(data.createdAt).fromNow()}
        </p>
        <div className="w-fit select-none">
          <p className="bg-blue-600 rounded-lg px-2 text text-sm text-white">
            {data.planType} plan
          </p>
        </div>
      </div>
      <div className=" m-3 mb-2 mt-10">
        <Link
          className="p-1 px-2 bg-blue-500 text-white rounded"
          href="/manager"
        >
          Go to manager
        </Link>
      </div>
    </div>
  );
};

import { Account } from "@/core/types";
import Image from "next/image";
import Link from "next/link";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";

interface AccountDetailsProps {
  data: Account;
}

export const AccountDetails = ({ data }: AccountDetailsProps) => {
  const {} = data;
  return (
    <div className="mt-2 flex flex-col items-center">
      <div className=" m-3 mb-2 mt-2">
        <Link
          className="p-1 px-2 bg-blue-500 text-white rounded"
          href="/manager"
        >
          Go to manager
        </Link>
      </div>
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
      <h1 className="font-semibold text-slate-700 text-lg">
        {data.preferredName}
      </h1>
      <div className="mt-10">
        <p className="bg-blue-400 rounded-md p-1 px-2">{data.planType} plan</p>
        <BsInfoCircleFill />
      </div>
    </div>
  );
};

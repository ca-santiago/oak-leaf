import { AccountDetails } from "@/components/account/details";
import { AccountHeader } from "@/components/accountHeader";
import { Account } from "@/core/types";
import { API_CONFIG } from "@/services/api";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";

const getAccountInfo = (token: string): Promise<Account> => {
  return fetch(`${API_CONFIG.accountsUrl}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(({ data }) => data)
    .catch((err) => console.log(err));
};

const Profile = async () => {
  const session = await getSession();
  const { accessToken } = session!;

  const res = await getAccountInfo(accessToken!);

  return (
    <div className="min-h-screen bg-[#ebeff4]">
      <AccountHeader session={session!} />
      <AccountDetails data={res} />
    </div>
  );
};

export default withPageAuthRequired(Profile, { returnTo: "/profile" });

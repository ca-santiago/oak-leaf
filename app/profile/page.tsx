import { AccountDetails } from "@/components/account/details";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountInfo } from "@/services/accounts";
import { getUserInviteCode } from "@/services/plans";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserInviteCode } from "./inviteCode";
import { Toaster } from "react-hot-toast";

const Profile = async () => {
  const session = await getSession();
  const { accessToken } = session!;

  const res = await getAccountInfo(accessToken!);
  const inviteData = await getUserInviteCode(accessToken!);

  return (
    <div className="min-h-screen bg-lightblue">
      <Toaster position="bottom-center" gutter={42} reverseOrder={false} />
      <AccountHeader session={session!} />
      <AccountDetails data={res} />
      {inviteData && (
        <div className="mt-12">
          <UserInviteCode accountInvite={inviteData} />
        </div>
      )}
    </div>
  );
};

export default withPageAuthRequired(Profile, { returnTo: "/profile" });

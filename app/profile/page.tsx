import { AccountDetails } from "@/components/account/details";
import { AccountHeader } from "@/components/accountHeader";
import { getAccountData } from "@/services/accounts";
import { getUserInviteCode } from "@/services/plans";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserInviteCode } from "./inviteCode";

const Profile = async () => {
  const session = await getSession();
  const { user } = session!;

  const [
    accountInfo,
    inviteData,
  ] = await Promise.all([
    getAccountData({ userId: user.sub }),
    getUserInviteCode(user.sub),
  ]);

  return (
    <div className="min-h-screen bg-lightblue">
      <AccountHeader session={ session! } />
      <AccountDetails data={ accountInfo } />
      { inviteData &&
        <div className="mt-12">
          <UserInviteCode accountInvite={ inviteData } />
        </div>
      }
    </div>
  );
};

export default withPageAuthRequired(Profile, { returnTo: "/profile" });

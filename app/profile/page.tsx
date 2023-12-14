import { AccountDetails } from "@/components/account/details";
import { AccountHeader } from "@/components/accountHeader";
import { VersionLabel } from "@/components/versionLabel";
import { getAccountInfo } from "@/services/accounts";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

const Profile = async () => {
  const session = await getSession();
  const { accessToken } = session!;

  const res = await getAccountInfo(accessToken!);

  return (
    <div className="min-h-screen bg-[#ebeff4]">
      <AccountHeader session={session!} />
      <AccountDetails data={res} />
      <VersionLabel />
    </div>
  );
};

export default withPageAuthRequired(Profile, { returnTo: "/profile" });

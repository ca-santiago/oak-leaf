import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { getProfileData } from "./getProfileData";

async function ManagerPage() {
  const session = await getSession();
  const { name, picture, email, sub } = session!.user;
  const res = await getProfileData(sub);

  const displayName = res?.preferredName || name || "";

  return (
    <div>
      {displayName && <div>Hello {displayName}</div>}
      <Image src={picture} alt="yo" height={100} width={100} />
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/" });

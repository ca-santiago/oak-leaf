// "use client";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

// export default withPageAuthRequired(({ user }) => {
//   return <div>{user.name}</div>;
// });

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

async function ManagerPage() {
  const session = await getSession();
  return <div>Hello {session!.user.name}</div>;
}

export default withPageAuthRequired(ManagerPage, { returnTo: "/" });

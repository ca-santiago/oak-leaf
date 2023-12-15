import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const PlansPage = async () => {
  return (
    <div className="min-h-screen bg-lightblue">
      <div>Work in progress...</div>
    </div>
  );
};

export default withPageAuthRequired(PlansPage, { returnTo: "/plans" });

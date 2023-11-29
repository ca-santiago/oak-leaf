import LoginButton from "@/components/login";
import { withApiAuthRequired, withPageAuthRequired } from "@auth0/nextjs-auth0";

const Profile = withPageAuthRequired(async () => {
  return (
    <div>
      <LoginButton />
    </div>
  );
});

export default Profile;
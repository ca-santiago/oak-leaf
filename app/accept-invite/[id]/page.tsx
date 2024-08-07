import { getInviteById } from "@/services/plans";
import { InvalidInvitationPage } from "./invalid";
import { ValidInvitationPage } from "./valid";

const Page = async ({ params }: { params: { id: string } }) => {
  const result = await getInviteById(params.id);

  if (!result || result?.usedByUserId) {
    return <InvalidInvitationPage />;
  }

  return <ValidInvitationPage inviteCode={result.inviteCode} />;
};

export default Page;

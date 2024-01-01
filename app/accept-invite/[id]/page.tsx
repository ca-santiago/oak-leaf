import { getInviteData } from "@/services/plans";
import { InvalidInvitationPage } from "./invalid";
import { ValidInvitationPage } from "./valid";

export default async ({ params }: { params: { id: string } }) => {
  const result = await getInviteData(params.id);

  if (!result || result?.usedByUserId) {
    return <InvalidInvitationPage />;
  }

  return <ValidInvitationPage inviteCode={result.inviteCode} />;
};

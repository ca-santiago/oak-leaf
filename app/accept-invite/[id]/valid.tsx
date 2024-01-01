"use client";
import { useRouter } from "next/navigation";

export const ValidInvitationPage = (params: { inviteCode: string }) => {
  const { push } = useRouter();
  return (
    <div className="pt-20 min-h-screen bg-lightblue">
      <h3 className="text-4xl font-semibold text-slate-700 text-center">
        Your where invited to habits app!
      </h3>
      <p className="text-lg font-semibold text-slate-500 text-center mt-3">
        Lets join and tackle goals together
      </p>
      <div className="flex items-center justify-center mt-10">
        <button
          className="p-2 px-4 bg-blue-500 text-white font-semibold rounded-md"
          onClick={() => {
            push(
              `/api/auth/login?inviteCode=${params.inviteCode}&useSignUp=true`
            );
          }}
        >
          Accept
        </button>
      </div>
      <p className="text-sm font-base text-slate-500 text-center mt-3">
        You can only use this invitation with a new account
      </p>
    </div>
  );
};

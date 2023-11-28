"use client";
import LoginButton from "@/components/login";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const { user, error, isLoading } = useUser();

  // TODO 11/28 casantiago - Render main page loading component
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading, please refresh the pager</div>;
  if (!user) return <LoginButton />;

  return (
    <div>
      {/* HEADER just for this page */}
      <div className="p-3 w-full">
        <Link
          className="p-2 px-3 text-white bg-blue-500 rounded-md"
          href="/profile"
        >
          See profile
        </Link>
      </div>
      <section>
        <div>Some header</div>
      </section>
    </div>
  );
}

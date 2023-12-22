import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { VersionLabel } from "@/components/versionLabel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oak Leaf",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <>
            {children}
            <VersionLabel />
          </>
        </UserProvider>
      </body>
    </html>
  );
}

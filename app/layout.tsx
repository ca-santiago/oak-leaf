import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { VersionLabel } from "@/components/versionLabel";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habitosca",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UserProvider>
          <>
            {children}
            <VersionLabel />
            <Toaster
              toastOptions={{
                duration: 1500,
              }}
              position="bottom-center"
              reverseOrder={false}
            />
          </>
        </UserProvider>
      </body>
    </html>
  );
}

import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Scrum Pointer Agile Planning Made Simple",
  description:
    "Effortlessly estimate and assign story points for Agile projects with Scrum Pointer. A collaborative and intuitive tool designed to streamline your sprint planning and boost team productivity.",
  icons: [{ rel: "icon", url: "icon.webp" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

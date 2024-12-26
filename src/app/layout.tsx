import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ToastContainer } from "react-toastify";

import { TRPCReactProvider } from "~/trpc/react";

import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import Script from "next/script";

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
        <TRPCReactProvider>
          {children}
          <ToastContainer />
        </TRPCReactProvider>
      </body>
      <Script
        strategy="afterInteractive"
        src="https://analytics.vramana.com/script.js"
        data-website-id="6907d82c-6420-4aa1-837d-f43968fb5c26"
      ></Script>
    </html>
  );
}

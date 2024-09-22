import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";

import { Hero } from "./_components/Hero";
import { Navbar } from "./_components/Navbar";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-col">
        <Navbar />
        <Hero />
      </main>
    </HydrateClient>
  );
}

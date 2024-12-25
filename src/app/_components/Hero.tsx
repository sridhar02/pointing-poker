"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import useLocalStorage from "../hooks/useLocalStorage";

export function Hero() {
  const router = useRouter();
  const [playerId, setPlayerId] = useLocalStorage<string>("playerId", "");
  // const [, setPlayerId] = useLocalStorage<string>("createdByPlayerId", "");

  const [name, setName] = useState("");

  const createSession = api.session.createSession.useMutation({
    onSuccess: (data) => {
      const { session, player } = data;
      setName("");
      setPlayerId(player.id);
      router.push(`/session/${session.id}`);
    },
  });

  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSession.mutate({ name });
  };

  return (
    <div className="flex flex-grow flex-col items-center">
      <div className="m-4 flex h-3/4 w-3/4 flex-col items-center justify-center rounded-md">
        <h1 className="mb-4 mt-3 text-center text-4xl font-bold md:text-4xl">
          Scrum Pointer for Agile Teams
        </h1>
        <p className="text-md mb-6">
          Easy-to-use and fun story point estimations.
        </p>
        <form
          action=""
          className="flex w-full max-w-sm flex-col gap-6"
          onSubmit={handleCreateSession}
        >
          <input
            placeholder="Enter Your Name"
            className="w-full rounded-md border-2 border-gray-200 p-3 text-lg text-gray-800 focus:border-blue-700 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mb-4 w-full rounded-md bg-blue-600 p-3 text-lg font-bold text-white shadow-md transition"
          >
            {createSession.isPending ? <>Loading...</> : "Create a New Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

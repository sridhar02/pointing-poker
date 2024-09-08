"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import useLocalStorage from "../hooks/useLocalStorage";

export function Hero() {
  const router = useRouter();
  const [playerId, setPlayerId] = useLocalStorage<string>("playerId", "");

  const [name, setName] = useState("");
  const [sessionCode, setSessionCode] = useState("");

  const createSession = api.session.createSession.useMutation({
    onSuccess: (data) => {
      const { session, player } = data;
      setName("");
      setSessionCode("");
      setPlayerId(player.id);
      router.push(`/session/${session.code}`);
    },
  });

  const handleCreateSession = async () => {
    createSession.mutate({ name });
  };

  return (
    <div className="m-10">
      <div className="flex flex-col rounded-md bg-gray-300 p-6">
        <h1 className="text-4xl font-bold">Pointing Poker</h1>
        <p className="mt-10 text-lg">
          Welcome to pointing poker (aka planning poker)! Online, virtual and
          co-located agile teams use this application during their
          planning/pointing sessions to effectively communicate points for
          stories.
        </p>
      </div>
      <div className="mt-4 flex w-full flex-col gap-3 md:flex-row">
        <div className="flex w-full flex-col rounded-md bg-gray-300 p-6">
          <div className="mt-4 flex w-full flex-col items-center justify-between gap-6">
            <div className="flex w-1/3 flex-col gap-2">
              <input
                type="text"
                placeholder="Enter your name"
                className="rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-sm text-gray-500">Max 10 characters *</p>
            </div>

            <div className="mt-4 w-1/3">
              <input
                type="text"
                placeholder="Enter session code"
                className="w-full rounded-md p-2"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
              />
            </div>

            <button className="w-1/3 rounded-md bg-blue-500 p-2 text-white">
              Join Session
            </button>

            <button
              className="w-1/3 rounded-md bg-blue-500 p-2 text-white"
              onClick={handleCreateSession}
            >
              Create a new session
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">Advantages of Pointing Poker</h2>
        <ul className="mt-4 flex list-disc flex-col gap-4 pl-4">
          <li>
            <p>
              <span className="font-bold">Speed:</span> Pointing poker is a fast
              way to get everyone&apos;s estimate for a story.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">Freedom:</span> Team members can
              choose to point from anywhere, whether it&apos;s in the office,
              remote, or even on the go.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">Desktop, tablet, mobile ready:</span>{" "}
              Pointing poker is a fast way to get everyone&apos;sestimate for a
              story.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">No sign-up required:</span> You can
              start a session without having to sign up for an account.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

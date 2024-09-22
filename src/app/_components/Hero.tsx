"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import useLocalStorage from "../hooks/useLocalStorage";

export function Hero() {
  const router = useRouter();
  const [playerId, setPlayerId] = useLocalStorage<string>("playerId", "");

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
    <div className="m-4 flex flex-col">
      <div className="flex flex-col rounded-md">
        <p className="mt-4 text-lg">
          Welcome to Scrum pointer (aka planning poker)! Online, virtual and
          co-located agile teams use this application during their
          planning/pointing sessions to effectively communicate points for
          stories.
        </p>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3">
        <div className="flex w-full items-center justify-center">
          <form
            action=""
            className="flex w-[300px] flex-col gap-4"
            onSubmit={handleCreateSession}
          >
            <input
              placeholder="Name"
              className="w-full rounded-md border-2 border-gray-300 p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="flex w-full justify-center">
              <button className="flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 text-white">
                {createSession.isPending ? (
                  <>Loading...</>
                ) : (
                  "Create a New Session"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="mt-4">
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
      </div> */}
    </div>
  );
}

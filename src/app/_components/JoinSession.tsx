"use client";

import { type ChangeEvent, useState } from "react";

import { type Player } from "@prisma/client";

import { api } from "~/trpc/react";

interface ownProps {
  id: string;
  setPlayer: (data: Player) => void;
}

export function JoinSession(props: ownProps) {
  const { id, setPlayer } = props;
  const [name, setName] = useState("");

  const { data: session, isLoading } = api.session.getCurrentSession.useQuery({
    id: id,
  });

  const createPlayer = api.player.createPlayer.useMutation({
    onSuccess: (data) => {
      if (data) setPlayer(data);
    },
  });

  if (isLoading)
    return <div className="my-4 text-xl font-semibold">Loading...</div>;

  if (!session)
    return (
      <div className="my-4 text-xl font-semibold">404 Session not found </div>
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPlayer.mutate({
      name: name,
      sessionId: id,
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white">
      <div className="m-4 mx-6 flex flex-col gap-2 rounded-md md:mx-0">
        <h1 className="mb-2 mt-3 text-center text-3xl font-bold md:text-4xl">
          Welcome to scrum Pointer
        </h1>
        <p className="text-md mb-6 text-center md:text-lg">
          Easy-to-use and fun story point estimations.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-6"
        >
          <input
            className="w-full max-w-md rounded-lg border-2 border-gray-300 p-2"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
          />
          <button className="w-1/2 rounded-md bg-blue-500 p-2 text-white">
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
}

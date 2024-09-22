"use client";

import { type ChangeEvent, useState } from "react";

import { api } from "~/trpc/react";

import useLocalStorage from "../hooks/useLocalStorage";

interface ownProps {
  id: string;
  setPlayerId: (id: string) => void;
}

export function JoinSession(props: ownProps) {
  const { id, setPlayerId } = props;
  const [name, setName] = useState("");

  const { data: session, isLoading } = api.session.getCurrentSession.useQuery({
    id: id,
  });

  const createPlayer = api.player.createPlayer.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data) setPlayerId(data.id);
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
    <div className="flex w-full justify-between bg-white">
      <form onSubmit={handleSubmit} className="mt-4 flex w-full gap-4">
        <input
          className="w-full rounded-md border-2 border-gray-300 p-2"
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
  );
}

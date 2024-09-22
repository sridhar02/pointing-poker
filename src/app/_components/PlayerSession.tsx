"use client";

import { useState } from "react";

import { type Player } from "@prisma/client";

import { pokerVotes } from "./session/utils";

interface ownProps {
  id: string;
  players: Player[] | undefined | null;
  currentPlayer: Player | undefined;
}

export function PlayerSession(props: ownProps) {
  const { currentPlayer, id, players } = props;
  const [des, setDes] = useState("");

  return (
    <div className="w-full p-2">
      <div className="text-lg text-gray-500">
        Session ID: <span className="text-blue-400">{id}</span>
      </div>
      <h3 className="my-2 text-xl font-semibold">
        {currentPlayer?.name} ({currentPlayer?.id})
      </h3>
      <div className="mt-2 flex flex-col gap-1">
        <label htmlFor="" className="text-lg text-gray-500">
          Story Description:
        </label>
        <textarea
          name="description"
          id=""
          className="w-full rounded-md border-2 border-gray-400 p-2"
          value={des}
          onChange={(e) => setDes(e.target.value)}
        />
      </div>

      <div className="mt-4 flex gap-20">
        <button className="rounded-md bg-blue-400 px-2 py-2 text-white">
          Clear votes
        </button>
        <button className="rounded-md bg-blue-400 px-2 py-2 text-white">
          Show Votes
        </button>
      </div>

      <div className="mt-4 flex w-1/2 flex-wrap justify-center gap-4">
        {pokerVotes.map((vote) => (
          <div
            key={vote.id}
            className="flex w-1/6 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 bg-teal-400 py-3 hover:border-blue-400"
          >
            {vote.name}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <h2 className="text-xl font-bold">Players</h2>
        <div>
          {players?.map((player) => (
            <div key={player.id} className="mt-4 flex items-center gap-2">
              <p className="text-xl">{player.name}</p>
              <p className="ml-4 text-xl">({player.id})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

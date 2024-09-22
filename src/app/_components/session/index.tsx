"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { api } from "~/trpc/react";

import { pokerVotes } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";

export function Session() {
  const { id } = useParams();
  const [playerId] = useLocalStorage<string>("playerId");

  const [des, setDes] = useState("");

  const { data: players } = api.player.getAllPlayers.useQuery(
    {
      sessionCode: id as string,
    },
    {
      enabled: id !== null,
    },
  );

  return (
    <div className="flex w-full justify-between bg-white">
      <div className="flex w-full">
        <div className="w-full">
          <div className="w-full p-2">
            <div>Session ID: {id}</div>
            <h3>Name: {playerId}</h3>
            <div className="mt-2 flex flex-col gap-1">
              <label htmlFor="" className="font-semibold">
                Story Description
              </label>
              <textarea
                name="description"
                id=""
                className="w-1/3 border-2 border-gray-400"
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
                  {vote.value}
                </div>
              ))}
            </div>

            <div className="mt-3">
              <h2 className="text-xl font-bold">Players</h2>
              <div>
                {players?.map((player) => (
                  <div key={player.id} className="mt-4 flex items-center gap-2">
                    <p className="text-xl">{player.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

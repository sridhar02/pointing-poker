"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { api } from "~/trpc/react";

import useLocalStorage from "../../hooks/useLocalStorage";
import { JoinSession } from "../JoinSession";
import { PlayerSession } from "../PlayerSession";

export function Session() {
  const { id } = useParams();
  const [playerId, setPlayerId] = useLocalStorage<string>("playerId", "");

  const { data: players } = api.player.getAllPlayers.useQuery(
    {
      sessionCode: id as string,
    },
    {
      enabled: id !== null,
      // refetchInterval: 1000,
    },
  );

  const currentPlayer = players?.find((player) => player.id === playerId);

  return (
    <div className="w-full bg-white">
      {playerId ? (
        <PlayerSession
          id={id as string}
          players={players}
          currentPlayer={currentPlayer}
        />
      ) : (
        <>
          <JoinSession id={id as string} setPlayerId={setPlayerId} />
        </>
      )}
    </div>
  );
}

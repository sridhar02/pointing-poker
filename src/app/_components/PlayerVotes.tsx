import React from "react";

import { type Player } from "@prisma/client";

import { pokerVotes } from "./session/utils";

interface OwnProps {
  players: Player[] | null | undefined;
  votesState: any[];
}

export const PlayerVotes = (props: OwnProps) => {
  const { players, votesState } = props;
  return (
    <div className="mt-3">
      <h2 className="text-xl font-bold">Players</h2>
      <div>
        {players?.map((player) => {
          const playerVote = votesState.find(
            (vote) => vote.playerId === player.id,
          );
          const finalizedVote = pokerVotes.find(
            (v) => v.id === playerVote?.vote,
          );
          return (
            <div key={player.id} className="mt-4 flex items-center gap-2">
              <p className="text-xl">{player.name}</p>
              <p className="ml-[340px] text-lg text-gray-600">
                {playerVote ? finalizedVote?.value : "No vote yet"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

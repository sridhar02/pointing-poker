import React from "react";

import { type Player,type Story } from "@prisma/client";

import { type RouterOutputs } from "~/trpc/react";

import { calculateAverage, pokerVotes } from "./session/utils";
type voteResponse = RouterOutputs["vote"]["createVote"];

interface OwnProps {
  players: Player[] | null | undefined;
  votesState: voteResponse[];
  clearedStories: Story[] | undefined;
}

export const PlayerVotes = (props: OwnProps) => {
  const { players, votesState, clearedStories } = props;
  const votesArray = votesState?.map((vote) => vote?.vote) ?? [];

  const mappedVotes = votesArray
    .map((vote) => pokerVotes.find((v) => v.id === vote))
    .filter(
      (voteObj): voteObj is { id: string; value: number; name: string } =>
        !!voteObj,
    );

  const average = calculateAverage(mappedVotes);
  console.log({ clearedStories });
  return (
    <div className="mt-3">
      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="flex flex-col justify-between gap-2">
            <h2 className="mt-4 text-xl font-bold">Players & votes </h2>
            <div className="fon flex flex-col gap-2 text-lg">
              <p className="font-semibold text-gray-500">
                Average: {average ? average.toFixed(2) : "No votes yet"}{" "}
              </p>
              <p className="font-semibold text-gray-500">
                Total Votes: {votesState.length}
              </p>
            </div>
          </div>
          <table className="table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Player Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Vote
                </th>
              </tr>
            </thead>
            <tbody>
              {players?.map((player) => {
                const playerVote = votesState.find(
                  (vote) => vote?.playerId === player.id,
                );
                const finalizedVote = pokerVotes.find(
                  (v) => v.id === playerVote?.vote,
                );
                return (
                  <tr key={player.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {player.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {playerVote ? finalizedVote?.value : "No vote yet"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="mt-4 text-xl font-bold">History</h2>
          {clearedStories?.map((story: Story) => (
            <ul key={story.id}>
              <li>
                <p>{story.title}</p>
                <p className="text-sm text-gray-500">
                  Cleared at: {story.clearedAt?.toLocaleString()}
                </p>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

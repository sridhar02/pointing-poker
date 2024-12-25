import React from "react";

import { type RouterOutputs } from "~/trpc/react";

import { pokerVotes } from "./session/utils";
type voteResponse = RouterOutputs["vote"]["createVote"];

interface OwnProps {
  currentPlayerVote: voteResponse | null | undefined;
  handleVote: (voteId: string) => void;
}

export const VotesList = (props: OwnProps) => {
  const { currentPlayerVote, handleVote } = props;
  return (
    <div className="my-4 mt-8 flex flex-wrap justify-center gap-4">
      {pokerVotes.map((vote) => (
        <div
          key={vote.id}
          className={`flex w-[60px] cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 py-3 hover:border-blue-400 ${currentPlayerVote && currentPlayerVote?.vote === vote.id ? "bg-blue-500" : "bg-teal-400"} `}
          onClick={() => handleVote(vote.id)}
        >
          {vote.name}
        </div>
      ))}
    </div>
  );
};

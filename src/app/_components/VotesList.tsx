import React from "react";

import { pokerVotes } from "./session/utils";

interface OwnProps {
  currentPlayerVote: any;
  handleVote: (voteId: string) => void;
}

export const VotesList = (props: OwnProps) => {
  const { currentPlayerVote, handleVote } = props;
  return (
    <div className="mt-4 flex w-1/2 flex-wrap justify-center gap-4">
      {pokerVotes.map((vote) => (
        <div
          key={vote.id}
          className={`flex w-1/6 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 py-3 hover:border-blue-400 ${currentPlayerVote && currentPlayerVote?.vote === vote.id ? "bg-blue-500" : "bg-teal-400"} `}
          onClick={() => handleVote(vote.id)}
        >
          {vote.name}
        </div>
      ))}
    </div>
  );
};

import React from "react";

import { type RouterOutputs } from "~/trpc/react";

import { calculateAverage, pokerVotes } from "./session/utils";
type voteResponse = RouterOutputs["vote"]["createVote"];

interface OwnProps {
  votesState: voteResponse[];
}

export const VotingResults = (props: OwnProps) => {
  const { votesState } = props;

  const votesArray = votesState.map((vote) => vote?.vote);

  const mappedVotes = votesArray.map((vote) => {
    const voteObj = pokerVotes.find((v) => v.id === vote);
    return voteObj;
  });

  // const average = mappedVotes && calculateAverage(mappedVotes);
  const average = 0;
  return (
    <div>
      <h3>Statics</h3>
      <p>Total Votes: {props.votesState.length}</p>
      <p>Average: {average}</p>
    </div>
  );
};

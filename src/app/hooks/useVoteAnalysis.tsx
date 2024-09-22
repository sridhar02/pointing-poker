import React, { useEffect,useState } from "react";

import { type Vote } from "@prisma/client";

export const useVoteAnalysis = (votesData: Vote[]) => {
  const [analysis, setAnalysis] = useState({
    voteCounts: {},
    totalVotes: 0,
    averageVote: 0,
  });

  useEffect(() => {
    let totalVotes = 0;
    let sumOfVotes = 0;
    const voteCounts: Record<string, number> = {};

    votesData.forEach((vote) => {
      const voteValue = vote.vote;
      voteCounts[voteValue] = (voteCounts[voteValue] ?? 0) + 1;
      totalVotes++;
      sumOfVotes += parseInt(voteValue);
    });

    const averageVote = sumOfVotes / totalVotes;

    setAnalysis({
      voteCounts,
      totalVotes,
      averageVote: parseFloat(averageVote.toFixed(2)),
    });
  }, [votesData]);

  return analysis;
};

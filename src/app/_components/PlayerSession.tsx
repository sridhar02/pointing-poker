"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  type Player,
  type Session,
  type Story,
  type Vote,
} from "@prisma/client";
import { Unsubscribable } from "@trpc/server/observable";

import { type AppRouter } from "~/server/api/root"; // Path to your app router
import { api, type RouterOutputs } from "~/trpc/react";

import { PlayerVotes } from "./PlayerVotes";
import { VotesList } from "./VotesList";
import { VotingResults } from "./VotingResults";

type VoteResponse = RouterOutputs["vote"]["createVote"];
// type onStoryUpdate = inferSubscriptionOutput["story"]["onStoryUpdate"];

interface ownProps {
  id: string;
  session: Session | null | undefined;
  players: Player[];
  currentPlayer: Player | undefined;
}

export function PlayerSession(props: ownProps) {
  const { currentPlayer, id, players, session } = props;

  const [showResults, setShowResults] = useState(false);
  const [story, setStory] = useState<{
    id: string | undefined;
    text: string | undefined;
  }>({
    id: undefined,
    text: "",
  });
  const [debouncedDescription] = useDebounce(story.text, 500);
  // const isCreator = currentPlayer?.id === session?.createdByPlayerId;

  // Story handlers
  const { data: stories } = api.story.getAllStories.useQuery(
    {
      sessionCode: id,
    },
    {
      enabled: id !== null,
    },
  );

  const createStory = api.story.createStory.useMutation({
    onSuccess: (data) => {
      if (data?.id) {
        setStory((prev) => ({
          ...prev,
          id: data.id,
          text: data.title, // Update the story ID after creation
        }));
      }
    },
  });

  const handleStory = (data: { action: string; story: Story }) => {
    const { action, story } = data;
    if (action === "story-text-update") {
      setStory({ id: story.id, text: story.title });
    }
  };

  api.story.onStoryUpdate.useSubscription(
    { sessionId: id },
    {
      onData: (data) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore for now eliminate this
        handleStory(data);
      },
      onError(err) {
        console.log("Subscription error: ", err);
      },
    },
  );

  const lastStory = stories?.[stories?.length - 1];

  /**
   * Votes handlers
   */

  const { data: votes } = api.vote.getAllVotes.useQuery({
    sessionCode: id,
    storyId: story.id ?? "",
  });

  const [votesState, setVotesState] = useState<VoteResponse[]>(votes ?? []);

  const createVote = api.vote.createVote.useMutation({
    onSuccess: (newVote) => {
      setVotesState((prevState) => {
        const existingVoteIndex = prevState.findIndex(
          (vote) =>
            vote?.playerId === newVote?.playerId &&
            vote?.storyId === newVote?.storyId,
        );
        if (existingVoteIndex !== -1) {
          const updatedVotes = [...prevState];
          updatedVotes[existingVoteIndex] = newVote;
          return updatedVotes;
        }

        // Add a new vote
        return [...prevState, newVote];
      });
    },
  });

  api.vote.onVoteUpdate.useSubscription(
    { sessionId: id },
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore overload error
      onData: ({ action, vote }: { action: string; vote: VoteResponse }) => {
        if (action === "vote-added") {
          setVotesState((prevState) => {
            const existingVoteIndex = prevState.findIndex(
              (item) =>
                item?.playerId === vote?.playerId &&
                item?.storyId === vote?.storyId,
            );

            if (existingVoteIndex !== -1) {
              const updatedVotes = [...prevState];
              updatedVotes[existingVoteIndex] = vote;
              return updatedVotes;
            }

            // Add a new vote
            return [...prevState, vote];
          });
        }
      },
    },
  );

  const handleVote = (voteId: string) => {
    if (currentPlayer && story.id) {
      createVote.mutate({
        sessionCode: id,
        storyId: story.id,
        playerId: currentPlayer?.id,
        vote: voteId,
        voteId: currentPlayerVote?.id ?? undefined,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const currentPlayerVote = votesState.find(
    (vote) => vote?.playerId === currentPlayer?.id,
  );

  // Effects
  useEffect(() => {
    if (stories && stories.length > 0) {
      const existingStory = stories?.[stories?.length - 1];
      setStory({
        id: existingStory?.id,
        text: existingStory?.title,
      });
    }
  }, [stories]);

  useEffect(() => {
    if (debouncedDescription && id) {
      createStory.mutate({
        title: debouncedDescription,
        sessionId: id,
        storyId: story.id ? story.id : undefined,
      });
    }
  }, [debouncedDescription]);

  useEffect(() => {
    if (votes) {
      setVotesState(votes);
    }
  }, [votes]);

  const handleNext = () => {
    console.log("Next round");
  };

  return (
    <div className="w-full p-2">
      <div className="text-lg text-gray-500">
        Session ID: <span className="text-blue-400">{id}</span>
      </div>
      <h3 className="my-2 text-xl font-semibold">{currentPlayer?.name}</h3>
      <div className="mt-2 flex flex-col gap-1">
        <label htmlFor="" className="text-lg text-gray-500">
          Story Description:
        </label>
        <textarea
          name="description"
          id=""
          className="w-full rounded-md border-2 border-gray-400 p-2"
          value={story.text}
          onChange={handleTextChange}
        />
      </div>
      <div className="mt-4 flex gap-20">
        <button
          className="rounded-md bg-blue-400 px-2 py-2 text-white"
          onClick={() => setShowResults(!showResults)}
        >
          Show Results
        </button>
        <button
          className="rounded-md bg-blue-400 px-2 py-2 text-white"
          onClick={handleNext}
        >
          Start Next Round
        </button>
      </div>

      <VotesList
        currentPlayerVote={currentPlayerVote}
        handleVote={handleVote}
      />
      <PlayerVotes players={players} votesState={votesState} />
      {showResults && <VotingResults votesState={votesState} />}
    </div>
  );
}

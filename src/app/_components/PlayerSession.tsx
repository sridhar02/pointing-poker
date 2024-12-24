"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  type Player,
  type Session,
  type Story,
  type Vote,
} from "@prisma/client";
import { type inferProcedureOutput } from "@trpc/server";

import { type AppRouter } from "~/server/api/root"; // Path to your app router
import { api, type RouterOutputs } from "~/trpc/react";

import { PlayerVotes } from "./PlayerVotes";
import { VotesList } from "./VotesList";

type VoteResponse = inferProcedureOutput<AppRouter["vote"]["createVote"]>;

interface ownProps {
  id: string;
  session: Session | null | undefined;
  players: RouterOutputs["player"]["getAllPlayers"];
  currentPlayer: Player | undefined;
}

export function PlayerSession(props: ownProps) {
  const { currentPlayer, id, players, session } = props;

  const [story, setStory] = useState<{ id: string | null; text: string }>({
    id: null,
    text: "",
  });
  const [debouncedDescription] = useDebounce(story.text, 500);
  const isCreator = currentPlayer?.id === session?.createdByPlayerId;

  // Story handlers
  const { data: stories } = api.story.getAllStories.useQuery(
    {
      sessionCode: id,
    },
    {
      enabled: id !== null && !isCreator,
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

  api.story.onStoryUpdate.useSubscription(
    { sessionId: id },
    {
      // @ts-expect-error onData is coming as overload error
      onData: ({ action, story }: { action: string; story: Story }) => {
        if (action === "story-text-update") {
          setStory({ id: story.id, text: story.title });
        }
      },
    },
  );

  const lastStory = stories?.[stories?.length - 1];

  /**
   * Votes handlers
   */

  const { data: votes } = api.vote.getAllVotes.useQuery({
    sessionCode: id,
    storyId: story.id || "",
  });

  const [votesState, setVotesState] = useState(votes || []);
  const createVote = api.vote.createVote.useMutation({
    onSuccess: (newVote) => {
      newVote &&
        setVotesState((prevState) => {
          const existingVoteIndex = prevState.findIndex(
            (vote) =>
              vote.playerId === newVote.playerId &&
              vote.storyId === newVote.storyId,
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
      // @ts-expect-error overload error
      onData: ({ action, vote }: { action: string; vote: VoteResponse }) => {
        if (action === "vote-added") {
          setVotesState((prevState) => {
            const existingVoteIndex = prevState.findIndex(
              (vote) =>
                vote.playerId === vote.playerId &&
                vote.storyId === vote.storyId,
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
    console.log({
      currentPlayerVote,
      lastStory,
      currentPlayer,
      storyId: story.id,
    });
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
    (v) => v.playerId === currentPlayer?.id,
  );

  // Effects
  useEffect(() => {
    if (stories && stories.length > 0) {
      const existingStory = stories?.[stories?.length - 1];
      existingStory &&
        setStory({
          id: existingStory.id,
          text: existingStory.title,
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

  console.log({ story, currentPlayerVote, currentPlayer, votesState });

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
          value={story.text}
          onChange={handleTextChange}
          disabled={!isCreator}
        />
      </div>

      {isCreator && (
        <div className="mt-4 flex gap-20">
          <button className="rounded-md bg-blue-400 px-2 py-2 text-white">
            Show Results
          </button>
          <button className="rounded-md bg-blue-400 px-2 py-2 text-white">
            Start Next Round
          </button>
        </div>
      )}

      <VotesList
        currentPlayerVote={currentPlayerVote}
        handleVote={handleVote}
      />
      <PlayerVotes players={players} votesState={votesState} />
    </div>
  );
}

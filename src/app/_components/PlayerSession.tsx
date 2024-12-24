"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { type Player, type Session } from "@prisma/client";

import { api, type RouterOutputs } from "~/trpc/react";
import { pokerVotes } from "./session/utils";
interface ownProps {
  id: string;
  session: Session | null | undefined;
  players: RouterOutputs["player"]["getAllPlayers"];
  currentPlayer: Player | undefined;
}

export function PlayerSession(props: ownProps) {
  const { currentPlayer, id, players, session } = props;

  const [des, setDes] = useState("");
  const [story, setStory] = useState<{ id: string | null; text: string }>({
    id: null,
    text: "",
  });
  const [debouncedDescription] = useDebounce(story.text, 500);

  const isCreator = currentPlayer?.id === session?.createdByPlayerId;

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
      console.log({ data });
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
      onData: ({ action, story }: { action: string; story: any }) => {
        console.log({ action, story });
        if (action === "story-text-update") {
          setStory({ id: story.id, text: story.title });
        }
      },
    },
  );

  const lastStory = stories?.[stories?.length - 1];

  // const { data: votes } = api.vote.getAllVotes.useQuery(
  //   {
  //     sessionCode: id,
  //     storyId: lastStory?.id,
  //   },
  //   {
  //     refetchInterval: 1000,
  //   },
  // );

  const handleBlur = () => {
    createStory.mutate({
      title: des,
      sessionId: id,
    });
  };

  const createVote = api.vote.createVote.useMutation({
    onSuccess: (data) => {
      // console.log(data);
    },
  });

  const handleVote = (voteId: string) => {
    if (lastStory && currentPlayer) {
      // console.log({
      //   sessionCode: id,
      //   storyId: lastStory?.id,
      //   playerId: currentPlayer?.id,
      //   vote: voteId,
      // });
      createVote.mutate({
        sessionCode: id,
        storyId: lastStory?.id,
        playerId: currentPlayer?.id,
        vote: voteId,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  console.log({ stories });
  useEffect(() => {
    if (stories && stories.length > 0) {
      const existingStory = stories?.[stories?.length - 1];
      console.log({ existingStory });
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

  console.log({ story });

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
            Clear votes
          </button>
          <button className="rounded-md bg-blue-400 px-2 py-2 text-white">
            Show Votes
          </button>
        </div>
      )}

      <div className="mt-4 flex w-1/2 flex-wrap justify-center gap-4">
        {pokerVotes.map((vote) => (
          <div
            key={vote.id}
            className="flex w-1/6 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 bg-teal-400 py-3 hover:border-blue-400"
            onClick={() => handleVote(vote.id)}
          >
            {vote.name}
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
  );
}

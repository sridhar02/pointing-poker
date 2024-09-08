"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Copy } from "lucide-react";
import { Story, Vote } from "@prisma/client";
import { AddStory } from "./AddStory";
import useLocalStorage from "../hooks/useLocalStorage";
import { VotesGraph } from "./VotesGraph";

// 2,3,5,8,13,20,40,100, ?, Cup
const votes = [
  { id: "1", value: 0 },
  { id: "2", value: 1 / 2 },
  { id: "3", value: 1 },
  { id: "4", value: 2 },
  { id: "5", value: 3 },
  { id: "6", value: 5 },
  { id: "7", value: 8 },
  { id: "8", value: 13 },
  { id: "9", value: 20 },
  { id: "10", value: 40 },
  { id: "11", value: 100 },
  { id: "12", value: "?" },
  { id: "13", value: "Cup" },
];

export function Session() {
  const { id } = useParams();
  const [playerId] = useLocalStorage<string>("playerId");

  const [allVotes, setAllVotes] = useState<Vote[]>([]);
  const [story, setStory] = useState<Story | null>(null);

  const { data: stories, isLoading } = api.story.getAllStories.useQuery(
    {
      sessionCode: id as string,
    },
    {
      enabled: id !== null,
    },
  );

  const { data } = api.vote.getAllVotes.useQuery(
    {
      sessionCode: id as string,
      storyId: story?.id as string,
    },
    {
      enabled: story !== null,
    },
  );

  const createVote = api.vote.createVote.useMutation({
    onSuccess: (data) => {
      if (data) {
        const filteredVotes = data.filter(
          (vote) => vote.vote !== "Cup" && vote.vote !== "?",
        );
        filteredVotes && setAllVotes(filteredVotes);
      }
    },
  });

  const handleVote = (vote: string) => {
    createVote.mutate({
      sessionCode: id as string,
      storyId: story?.id as string,
      playerId: playerId as string,
      vote: vote,
    });
  };

  const showVotes = story && allVotes && allVotes.length > 0;
  const isStorySelected = story && allVotes && allVotes.length === 0;

  return (
    <div className="flex w-full justify-between">
      <div className="flex w-full">
        <div className="w-full p-2">
          <div className="flex items-center gap-2">
            <div className="text-md w-1/3 rounded-md border-2 border-yellow-300 p-2">
              Session ID: <span className="font-bold">{id}</span>
            </div>
            <Copy className="cursor-pointer" />
          </div>
          {showVotes && <VotesGraph allVotes={allVotes} story={story} />}
          {isStorySelected && (
            <div className="flex flex-col p-2">
              <h2 className="mt-10 text-xl">
                Story Title:{" "}
                <span className="text-xl font-semibold">{story.title}</span>
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-10">
                {votes.map((vote) => (
                  <div
                    key={vote.id}
                    className="flex h-[181px] w-[133px] cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 px-4 py-3 hover:border-blue-400"
                    onClick={() => handleVote(String(vote.value))}
                  >
                    <div className="m-2 flex h-[120px] w-[95px] items-center justify-center rounded-md border-2 border-gray-300">
                      {vote.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!story && (
            <>
              <div className="mt-4 flex h-full flex-col items-center justify-center gap-2">
                <div>Add an issue to start with</div>
                <AddStory
                  id={id as string}
                  setStory={setStory}
                  setAllVotes={setAllVotes}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {stories && stories?.length > 0 && (
        <div className="flex w-1/3 flex-col justify-between border-l-2 border-gray-200 p-2">
          <div className="w-full">
            <h3 className="text-lg font-semibold">Stories to vote</h3>
            <div className="mt-4 flex w-full flex-col gap-4">
              {stories?.map((story) => (
                <div
                  key={story.id}
                  className="w-full cursor-pointer rounded-md border-2 border-blue-300 p-3"
                  onClick={() => setStory(story)}
                >
                  <div className="text-md">{story.title}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <AddStory
              id={id as string}
              setStory={setStory}
              setAllVotes={setAllVotes}
            />
          </div>
        </div>
      )}
    </div>
  );
}

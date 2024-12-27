"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

import { type Player, type Session, type Story } from "@prisma/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api, type RouterOutputs } from "~/trpc/react";

import { PlayerVotes } from "./PlayerVotes";
import { VotesList } from "./VotesList";

type VoteResponse = RouterOutputs["vote"]["createVote"];
interface ownProps {
  id: string;
  session: Session | null | undefined;
  players: Player[];
  currentPlayer: Player | undefined;
}

type LocalStory = {
  id: string | undefined;
  text: string | undefined;
};

export function PlayerSession(props: ownProps) {
  const utils = api.useUtils();

  const { currentPlayer, id, players, session } = props;

  const [story, setStory] = useState<LocalStory>({
    id: undefined,
    text: "",
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const [debouncedDescription] = useDebounce(story.text, 600);
  const isCreator = currentPlayer?.id === session?.createdByPlayerId;

  // Story handlers
  const createStory = api.story.createStory.useMutation({
    onSuccess: (data) => {
      if (data?.id) {
        setStory((prev) => ({
          ...prev,
          id: data.id,
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

  // const lastStory = stories?.[stories?.length - 1];

  /**
   * Votes handlers
   */

  const { data: votes } = api.vote.getAllVotes.useQuery({
    sessionCode: id,
    storyId: story.id ?? "",
  });

  const [votesState, setVotesState] = useState<VoteResponse[]>(votes ?? []);

  const createVote = api.vote.createVote.useMutation({
    onSuccess: () => {
      utils.vote.getAllVotes
        .invalidate({ storyId: story.id, sessionCode: id })
        .then(() => {
          // No return value here, ensuring the function adheres to the void return type.
        })
        .catch((error) => {
          console.error("Error invalidating votes:", error);
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
          utils.vote.getAllVotes
            .invalidate({ storyId: story.id, sessionCode: id })
            .then(() => {
              // No return value here, ensuring the function adheres to the void return type.
            })
            .catch((error) => {
              console.error("Error invalidating votes:", error);
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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStory((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const currentPlayerVote = votesState.find(
    (vote) => vote?.playerId === currentPlayer?.id,
  );

  // clear story
  const clearStory = api.session.clearDescription.useMutation();
  const { data: clearedStories } = api.story.getClearedStories.useQuery({
    sessionId: id,
  });

  api.session.onStoryClear.useSubscription(
    { sessionId: id },
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore overload error
      onData: () => {
        setVotesState([]);
        setStory({
          id: undefined,
          text: "",
        });
        utils.story.getClearedStories
          .invalidate({ sessionId: id })
          .then(() => {
            // No return value here, ensuring the function adheres to the void return type.
          })
          .catch((error) => {
            console.error("Error invalidating stories:", error);
          });
      },
      onError: (error) => {
        console.error("Subscription error:", error);
      },
    },
  );

  // Effects
  // useEffect(() => {
  //   if (stories && stories.length > 0) {
  //     const existingStory = stories?.[stories?.length - 1];
  //     setStory({
  //       id: existingStory?.id,
  //       text: existingStory?.title,
  //     });
  //   }
  // }, [stories]);

  useEffect(() => {
    if (debouncedDescription && debouncedDescription?.trim() !== "" && id) {
      createStory.mutate({
        title: debouncedDescription,
        sessionId: id,
        storyId: story.id ? story.id : undefined,
      });
    }
  }, [debouncedDescription, id]);

  useEffect(() => {
    if (votes) {
      setVotesState(votes);
    }
  }, [votes]);

  const handleClear = () => {
    if (story?.id) {
      clearStory.mutate(
        { sessionId: id, storyId: story?.id },
        {
          onSuccess: () => {
            utils.story.getClearedStories
              .invalidate({ sessionId: id })
              .then(() => {
                // No return value here, ensuring the function adheres to the void return type.
              })
              .catch((error) => {
                console.error("Error invalidating stories:", error);
              });
          },
        },
      );
    }
    setVotesState([]);
    setStory({
      id: undefined,
      text: "",
    });
  };
  const handleInvite = async () => {
    const currentUrl = window && window.location.href; // Get the current URL
    try {
      await navigator.clipboard.writeText(currentUrl); // Copy to clipboard
      toast("URL copied to clipboard!", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Failed to copy URL. Please try again."); // Show error toast
    }
  };

  return (
    <div className="p-2 px-4">
      <div className="mt-2 flex flex-col gap-1">
        <div className="flex justify-end md:flex-row md:items-center">
          <button
            className="w-1/3 cursor-pointer rounded-md border-2 bg-blue-500 p-2 font-medium text-white md:w-1/4 md:px-6"
            onClick={handleInvite}
          >
            + Invite Players
          </button>
        </div>
        <label htmlFor="" className="text-lg text-gray-500">
          Story Description:
        </label>
        <input
          name="description"
          id=""
          className="mw-full rounded-md border-2 border-gray-400 p-2"
          value={story.text}
          onChange={handleTextChange}
          disabled={!isCreator}
        />
        {isCreator && (
          <div className="flex items-center justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    className="mr-2 mt-6 h-6 w-6 cursor-pointer text-blue-500 hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 19c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent className="w-[350px]">
                  {`Clicking "Clear Votes" will reset all current votes for this
                  story and move the story to the history section for reference.`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              className="mt-4 w-1/3 rounded-md bg-blue-400 px-2 py-2 text-white md:w-1/4"
              onClick={handleClear}
            >
              Clear Votes
            </button>
          </div>
        )}
      </div>

      <VotesList
        currentPlayerVote={currentPlayerVote}
        handleVote={handleVote}
      />
      <PlayerVotes
        players={players}
        votesState={votesState}
        clearedStories={clearedStories}
        currentPlayer={currentPlayer}
      />
    </div>
  );
}

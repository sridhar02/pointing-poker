import { Story, Vote } from "@prisma/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";

type AddStoryProps = {
  id: string;
  setStory: (data: Story | null) => void;
  setAllVotes: (data: Vote[]) => void;
};

export function AddStory(props: AddStoryProps) {
  const { id, setStory, setAllVotes } = props;

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  const addStory = api.story.createStory.useMutation({
    onSuccess: (data) => {
      setAllVotes([]);
      setStory(data);
      setTitle("");
      setLink("");
    },
  });

  const handleAddStory = async () => {
    addStory.mutate({
      sessionCode: id,
      title: title,
      link: link,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button className="rounded-md bg-blue-500 p-2 text-white">
          + Add new issue
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Issue Details</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input
                placeholder="Issue Title"
                className="w-full rounded-md border-2 border-black p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs">Max 100 characters</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <input
                placeholder="Link (Optional)"
                className="w-full rounded-md border-2 border-black p-2"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <p className="text-xs">Max 100 characters</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddStory}>
            Add Issue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

type OwnProps = {
  handleSignOut: () => void;
};

export default function SignOutComponent({ handleSignOut }: OwnProps) {
  const [open, setOpen] = useState(false);

  const confirmSignOut = () => {
    setOpen(false); // Close the dialog
    handleSignOut(); // Perform the sign-out logic
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="cursor-pointer rounded-md border-2 bg-blue-600 p-1 px-4 text-white hover:bg-blue-500"
          >
            Sign Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will sign you out of your account. You will need to
              log in again to continue using the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-500"
              onClick={confirmSignOut}
            >
              Sign Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

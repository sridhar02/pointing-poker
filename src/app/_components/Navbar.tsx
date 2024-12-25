"use client";

import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export function Navbar() {
  const { id } = useParams();

  const handleInvite = async () => {
    const currentUrl = window.location.href; // Get the current URL
    try {
      await navigator.clipboard.writeText(currentUrl); // Copy to clipboard
      toast("URL copied to clipboard!", {
        position: "bottom-right",
      }); // Show success toast
    } catch (error) {
      toast.error("Failed to copy URL. Please try again."); // Show error toast
    }
  };

  return (
    <div
      className={`flex items-center justify-between border-b-2 bg-blue-600 p-2 text-white`}
    >
      <h1 className="ml-4 text-2xl font-bold">Scrum Pointer</h1>
      {id ? (
        <div className="mr-4 flex items-center gap-6">
          <p>Guest user</p>
          <button> Sign out</button>
          <button
            className="cursor-pointer rounded-md border-2 bg-white p-2 px-6 font-medium text-blue-500"
            onClick={handleInvite}
          >
            + Invite Players
          </button>
        </div>
      ) : (
        <div className="ml-4 flex justify-between gap-8"></div>
      )}
    </div>
  );
}

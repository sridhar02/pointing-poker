"use client";

import { Player } from "@prisma/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { id } = useParams();
  const router = useRouter();

  const [player] = useLocalStorage<Player>("player", undefined);
  const handleSignOut = () => {
    localStorage.removeItem("player");
    router.push("/");
  };

  return (
    <div
      className={`flex items-center justify-between border-b-2 bg-blue-600 p-2 text-white`}
    >
      <h1 className="ml-4 text-2xl font-bold">Scrum Pointer</h1>
      {id ? (
        <div className="mr-4 flex items-center gap-6">
          <p className="text-lg">
            {player?.name} <span className="text-sm">(Guest user)</span>
          </p>

          <button
            className="cursor-pointer rounded-md border-2 p-1 px-4"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="ml-4 flex justify-between gap-8"></div>
      )}
    </div>
  );
}

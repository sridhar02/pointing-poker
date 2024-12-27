"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { type Player } from "@prisma/client";

import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

export function Navbar() {
  const { id } = useParams();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };

    updateIsMobile();

    window.addEventListener("resize", updateIsMobile);

    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    const storedPlayer = JSON.parse(localStorage.getItem("player") || "null");
    setPlayer(storedPlayer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("player");
    router.push("/");
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`border-b-2 bg-blue-600 p-2 text-white md:flex md:justify-between`}
    >
      <div className="flex flex-row justify-between md:flex-col">
        <h1 className="ml-0 text-2xl font-bold md:ml-4">Scrum Pointer</h1>
        <button className="md:hidden" onClick={handleToggleMenu}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="flex items-center justify-between gap-6 p-1">
          {player && (
            <p className="text-lg">
              {player?.name} <span className="text-sm">(Guest user)</span>
            </p>
          )}

          <button
            className="cursor-pointer rounded-md border-2 p-1 px-4"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}

      {!isMobile && (
        <div className="mr-4 hidden items-center gap-6 md:flex">
          {player && (
            <>
              <p className="text-lg">
                {player?.name} <span className="text-sm">(Guest user)</span>
              </p>

              <button
                className="cursor-pointer rounded-md border-2 p-1 px-4"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

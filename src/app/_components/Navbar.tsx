"use client";

import { useParams } from "next/navigation";

export function Navbar() {
  const { id } = useParams();
  return (
    <div className="flex items-center justify-between border-b-2 bg-blue-600 p-4 text-white">
      <h1 className="text-xl font-bold">Scrum Pointer</h1>
      {id ? (
        <div></div>
      ) : (
        <div className="ml-4 flex justify-between gap-8"></div>
      )}
    </div>
  );
}

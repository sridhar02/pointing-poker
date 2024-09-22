"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { AvatarComponent } from "./Avatar";

export function SessionSidebar() {
  const { id } = useParams();
  const { data: players, isLoading } = api.player.getAllPlayers.useQuery(
    {
      sessionCode: id as string,
    },
    {
      enabled: id !== null,
    },
  );

  return (
    <div className="h-full w-[250px] border-r-2 border-gray-300 bg-white p-2">
      {isLoading ? (
        <div>loading ...</div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">Voting Users ()</h2>
          <div>
            {players?.map((player) => (
              <div key={player.id} className="mt-4 flex items-center gap-2">
                <AvatarComponent name={player.name} />
                <p className="text-xl">{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

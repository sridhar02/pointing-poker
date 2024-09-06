"use client";

export function Navbar() {
  return (
    <div className="flex items-center justify-start bg-black p-4 text-white">
      <h1 className="text-2xl font-bold">Pointing Poker</h1>
      <div className="ml-4 flex justify-between gap-8">
        <div>Home</div>
        <div>About</div>
        <div>Retro</div>
        <div>Hall of Fame</div>
      </div>
    </div>
  );
}

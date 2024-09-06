"use client";

export function Hero() {
  return (
    <div className="m-10">
      <div className="flex flex-col rounded-md bg-gray-300 p-6">
        <h1 className="text-4xl font-bold">Pointing Poker</h1>
        <p className="mt-10 text-lg">
          Welcome to pointing poker (aka planning poker)! Online, virtual and
          co-located agile teams use this application during their
          planning/pointing sessions to effectively communicate points for
          stories.
        </p>
      </div>
      <div className="mt-4 flex w-full">
        <div className="flex w-1/2 flex-col rounded-md bg-gray-300 p-6">
          <div>
            <h2> Pointing Session</h2>
            <div className="mt-4 flex items-center justify-between">
              <button className="rounded-md bg-blue-500 p-2 text-white">
                {" "}
                Start a Session{" "}
              </button>
              <p>...or...</p>
              <div>
                <input
                  type="text"
                  placeholder="Enter session code"
                  className="mr-2 rounded-md p-2"
                />
                <button className="rounded-md bg-blue-500 p-2 text-white">
                  Join Session
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex w-1/2 flex-col rounded-md bg-gray-300 p-6">
          <div>
            <h2> Retrospective Session</h2>
            <div className="mt-4 flex items-center justify-between">
              <button className="rounded-md bg-blue-500 p-2 text-white">
                {" "}
                Start a Session{" "}
              </button>
              <p>...or...</p>
              <div>
                <input
                  type="text"
                  placeholder="Enter session code"
                  className="mr-2 rounded-md p-2"
                />
                <button className="rounded-md bg-blue-500 p-2 text-white">
                  Join Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">Advantages of Pointing Poker</h2>
        <ul className="mt-4 flex list-disc flex-col gap-4 pl-4">
          <li>
            <p>
              <span className="font-bold">Speed:</span> Pointing poker is a fast
              way to get everyone&apos;s estimate for a story.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">Freedom:</span> Team members can
              choose to point from anywhere, whether it&apos;s in the office,
              remote, or even on the go.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">Desktop, tablet, mobile ready:</span>{" "}
              Pointing poker is a fast way to get everyone&apos;sestimate for a
              story.
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">No sign-up required:</span> You can
              start a session without having to sign up for an account.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

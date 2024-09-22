import { Session } from "~/app/_components/session";
import { SessionSidebar } from "~/app/_components/sessionSidebar";

export default function SessionPage() {
  return (
    <div className="flex h-screen w-full justify-start p-5 px-10">
      {/* <SessionSidebar /> */}
      <Session />
    </div>
  );
}

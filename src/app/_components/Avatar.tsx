import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function AvatarComponent(props: { name: string }) {
  const { name = "" } = props;

  return (
    <Avatar>
      <AvatarImage src={``} />
      <AvatarFallback className="bg-gray-300 p-2 text-xl uppercase text-black">
        {name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

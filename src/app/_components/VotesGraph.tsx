import { Story, Vote } from "@prisma/client";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useVoteAnalysis } from "../hooks/useVoteAnalysis";

type voteGraphProps = {
  allVotes: Vote[];
  story: Story;
};

export function VotesGraph(props: voteGraphProps) {
  const { allVotes, story } = props;
  const { voteCounts, totalVotes, averageVote } = useVoteAnalysis(allVotes);

  const graphData = Object.entries(voteCounts).map(([key, value]) => ({
    countValue: value,
    name: key,
  }));

  return (
    <div className="m-2 mt-4 rounded-md border-2 border-gray-300 p-4">
      <h2 className="text-xl font-semibold">{story.title}</h2>
      <div className="mt-[100px] flex items-end justify-between">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20 }}
              width={300}
              height={600}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="countValue"
                fill="#8884d8"
                activeBar={<Rectangle fill="lightblue" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mb-10 flex flex-col items-end justify-end gap-2">
          <div className="flex h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-full border-2 bg-blue-600 p-2 text-white">
            <h3 className="text-xl">Average</h3>
            <div className="text-2xl">{averageVote}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

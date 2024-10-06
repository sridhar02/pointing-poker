import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const voteRouter = createTRPCRouter({
  createVote: publicProcedure
    .input(
      z.object({
        sessionCode: z.string(),
        storyId: z.string(),
        playerId: z.string(),
        vote: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });

      const voteResponse =
        session &&
        (await ctx.db.vote.create({
          data: {
            sessionId: session.id,
            storyId: input.storyId,
            playerId: input.playerId,
            vote: input.vote,
          },
        }));

      return voteResponse;
    }),

  getAllVotes: publicProcedure
    .input(
      z.object({
        sessionCode: z.string(),
        storyId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });

      const allVotes =
        session &&
        (await ctx.db.vote.findMany({
          where: {
            sessionId: session.id,
            storyId: input.storyId,
          },
          include: {
            player: true,
            story: true,
          },
        }));
      return allVotes;
    }),
});

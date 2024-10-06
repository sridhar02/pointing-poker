import { create } from "domain";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const playerRouter = createTRPCRouter({
  getAllPlayers: publicProcedure
    .input(z.object({ sessionCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });

      return (
        session &&
        (await ctx.db.player.findMany({
          where: {
            sessionId: session.id,
          },
          include: {
            Vote: {
              include: {
                story: true,
              },
            },
          },
        }))
      );
    }),
  createPlayer: publicProcedure
    .input(z.object({ name: z.string(), sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
        },
      });

      const player =
        session &&
        (await ctx.db.player.create({
          data: {
            name: input.name,
            sessionId: session.id,
          },
        }));

      return player;
    }),
});

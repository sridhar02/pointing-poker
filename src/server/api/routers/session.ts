import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  createSession: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.create({
        data: {},
      });

      const player = await ctx.db.player.create({
        data: {
          name: input.name,
          sessionId: session.id,
        },
      });

      const updatedSession = await ctx.db.session.update({
        where: {
          id: session.id,
        },
        data: {
          createdByPlayerId: player.id,
        },
      });

      return {
        session: updatedSession,
        player,
      };
    }),
  getCurrentSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.id,
        },
      });
      return session;
    }),
});

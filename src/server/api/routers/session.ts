import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  createSession: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.create({
        data: {},
      });

      console.log(session);

      const player = await ctx.db.player.create({
        data: {
          name: input.name,
          sessionId: session.id,
        },
      });

      console.log(player);

      return {
        session,
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
      console.log(session);
      return session;
    }),
});

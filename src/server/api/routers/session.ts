import { z } from "zod";
import { init } from "@paralleldrive/cuid2";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createCode = init({ length: 6 });

export const sessionRouter = createTRPCRouter({
  createSession: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uniqueCode = createCode();
      const session = await ctx.db.session.create({
        data: {
          code: uniqueCode,
        },
      });

      const player = await ctx.db.player.create({
        data: {
          name: input.name,
          sessionId: session.id,
        },
      });

      return {
        session,
        player,
      };
    }),
});

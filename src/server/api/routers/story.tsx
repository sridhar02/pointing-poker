import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storyRouter = createTRPCRouter({
  getAllStories: publicProcedure
    .input(z.object({ sessionCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });
      return (
        session &&
        (await ctx.db.story.findMany({
          where: {
            sessionId: session.id,
          },
        }))
      );
    }),

  createStory: publicProcedure
    .input(
      z.object({
        title: z.string(),
        sessionId: z.string(),
        link: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
        },
      });
      const story =
        session &&
        (await ctx.db.story.create({
          data: {
            title: input.title,
            sessionId: session.id,
          },
        }));

      return story;
    }),
});

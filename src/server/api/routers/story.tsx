import { EventEmitter } from "events";
import { z } from "zod";

import { type Story } from "@prisma/client";
import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const storyEvents = new EventEmitter();

export const storyRouter = createTRPCRouter({
  getAllStories: publicProcedure
    .input(z.object({ sessionCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });
      if (!session) return;

      return await ctx.db.story.findMany({
        where: {
          sessionId: session.id,
        },
      });
    }),

  onStoryUpdate: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(({ input }) => {
      return observable((emit) => {
        const onStoryUpdate = (data: {
          sessionId: string;
          action: string;
          story: Story;
        }) => {
          if (data.sessionId === input.sessionId) {
            emit.next({ action: data.action, story: data.story });
          }
        };
        storyEvents.on("story-update", onStoryUpdate);

        return () => {
          storyEvents.off("story-update", onStoryUpdate);
        };
      });
    }),

  getActiveStories: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.story.findMany({
        where: {
          sessionId: input.sessionId,
          isCleared: false,
        },
      });
    }),

  getClearedStories: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.story.findMany({
        where: {
          sessionId: input.sessionId,
          isCleared: true,
        },
        orderBy: {
          clearedAt: "desc", // Show the most recently cleared stories first
        },
      });
    }),

  createStory: publicProcedure
    .input(
      z.object({
        title: z.string(),
        sessionId: z.string(),
        link: z.string().optional(),
        storyId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
        },
      });

      if (!session) return;

      let story;
      if (input.storyId) {
        story = await ctx.db.story.update({
          where: { id: input.storyId },
          data: { title: input.title },
        });
      } else {
        story = await ctx.db.story.create({
          data: {
            title: input.title,
            sessionId: session.id,
          },
        });
      }

      // Emit an event for the newly created player
      if (story) {
        console.log(story);
        storyEvents.emit("story-update", {
          sessionId: input.sessionId,
          action: "story-text-update",
          story,
        });
      }

      return story;
    }),
});

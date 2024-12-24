import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

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
      console.log({ session });
      return (
        session &&
        (await ctx.db.story.findMany({
          where: {
            sessionId: session.id,
          },
        }))
      );
    }),

  onStoryUpdate: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(({ input }) => {
      console.log("Received story-update event:");
      return observable<{ action: string; story: any }>((emit) => {
        const onStoryUpdate = (data: {
          sessionId: string;
          action: string;
          story: any;
        }) => {
          console.log({ data });
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

      let story;
      if (input.storyId) {
        story = await ctx.db.story.update({
          where: { id: input.storyId },
          data: { title: input.title },
        });
      } else {
        story =
          session &&
          (await ctx.db.story.create({
            data: {
              title: input.title,
              sessionId: session.id,
            },
          }));
      }

      // Emit an event for the newly created player
      if (story) {
        console.log("came here");

        storyEvents.emit("story-update", {
          sessionId: input.sessionId,
          action: "story-text-update",
          story,
        });
      }

      return story;
    }),
});

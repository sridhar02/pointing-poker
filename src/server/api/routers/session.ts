import { customAlphabet } from "nanoid";
import { EventEmitter } from "stream";
import { z } from "zod";

import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const sessionEvents = new EventEmitter();

export const sessionRouter = createTRPCRouter({
  createSession: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alphanumeric =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const sessionId = customAlphabet(alphanumeric, 12);
      const session = await ctx.db.session.create({
        data: {
          id: sessionId(),
        },
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

  onStoryClear: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ story: { id: string; title: string } }>((emit) => {
        const onStoryClear = (data: {
          sessionId: string;
          story: { id: string; title: string };
        }) => {
          if (data.sessionId === input.sessionId) {
            emit.next(data);
          }
        };

        sessionEvents.on("story-cleared", onStoryClear);

        return () => {
          sessionEvents.off("story-cleared", onStoryClear);
        };
      });
    }),

  clearDescription: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        storyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const story = await ctx.db.story.update({
        where: { id: input.storyId },
        data: {
          isCleared: true,
          clearedAt: new Date(),
        },
      });

      // Emit an event to notify all users
      sessionEvents.emit("story-cleared", {
        sessionId: input.sessionId,
        story: { id: story.id, title: story.title },
      });

      return { success: true, story };
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

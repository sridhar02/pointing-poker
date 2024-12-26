import { EventEmitter } from "events";
import { z } from "zod";

import { type Prisma } from "@prisma/client";
import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type voteResponse = Prisma.VoteGetPayload<{
  include: {
    player: true;
    story: true;
  };
}>;

const voteEvents = new EventEmitter();

export const voteRouter = createTRPCRouter({
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
      if (!session) return;

      const allVotes = await ctx.db.vote.findMany({
        where: {
          sessionId: session.id,
          storyId: input.storyId,
        },
        include: {
          player: true,
          story: true,
        },
      });
      return allVotes;
    }),

  onVoteUpdate: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ action: string; vote: voteResponse }>((emit) => {
        const onStoryUpdate = (data: {
          sessionId: string;
          storyId: string;
          action: string;
          vote: voteResponse;
        }) => {
          if (data.sessionId === input.sessionId) {
            emit.next({ action: data.action, vote: data.vote });
          }
        };
        voteEvents.on("vote-update", onStoryUpdate);

        return () => {
          voteEvents.off("vote-update", onStoryUpdate);
        };
      });
    }),
  createVote: publicProcedure
    .input(
      z.object({
        sessionCode: z.string(),
        storyId: z.string(),
        playerId: z.string(),
        vote: z.string(),
        voteId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });
      if (!session) return;

      let voteResponse;
      if (input.voteId) {
        voteResponse = await ctx.db.vote.update({
          where: { id: input.voteId },
          data: {
            sessionId: session.id,
            storyId: input.storyId,
            playerId: input.playerId,
            vote: input.vote,
          },
          include: {
            player: true, // Include player relation
            story: true, // Include story relation
          },
        });
      } else {
        voteResponse = await ctx.db.vote.create({
          data: {
            sessionId: session.id,
            storyId: input.storyId,
            playerId: input.playerId,
            vote: input.vote,
          },
          include: {
            player: true, // Include player relation
            story: true, // Include story relation
          },
        });
      }

      if (voteResponse) {
        voteEvents.emit("vote-update", {
          sessionId: session.id,
          storyId: input.storyId,
          action: "vote-added",
          vote: voteResponse,
        });
      }

      return voteResponse;
    }),
});

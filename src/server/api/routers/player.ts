import { create } from "domain";
import { EventEmitter } from "events";
import { z } from "zod";

import { type Player } from "@prisma/client";
import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const playerEvents = new EventEmitter();

export const playerRouter = createTRPCRouter({
  getAllPlayers: publicProcedure
    .input(z.object({ sessionCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionCode,
        },
      });
      if (!session) return;

      return await ctx.db.player.findMany({
        where: {
          sessionId: session.id,
        },
      });
    }),

  onPlayerUpdate: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ action: string; player: Player }>((emit) => {
        const onPlayerUpdate = (data: {
          sessionId: string;
          action: string;
          player: Player;
        }) => {
          if (data.sessionId === input.sessionId) {
            emit.next({ action: data.action, player: data.player });
          }
        };
        playerEvents.on("player-update", onPlayerUpdate);

        return () => {
          playerEvents.off("player-update", onPlayerUpdate);
        };
      });
    }),

  createPlayer: publicProcedure
    .input(z.object({ name: z.string(), sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
        },
      });
      if (!session) return;

      const player = await ctx.db.player.create({
        data: {
          name: input.name,
          sessionId: session.id,
        },
      });

      // Emit an event for the newly created player
      if (player) {
        playerEvents.emit("player-update", {
          sessionId: input.sessionId,
          action: "created",
          player,
        });
      }

      return player;
    }),
});

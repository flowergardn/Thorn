import { createTRPCRouter, publicProcedure } from "../../trpc";

import axios from "axios";
import { dateFormat, toProperUUID } from "../../../../utils/general";
import { z } from "zod";

export const kickRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.litebans_kicks.findMany();
  }),

  parsedData: publicProcedure.query(async ({ ctx }) => {
    const kicks = await ctx.prisma.litebans_kicks.findMany();

    return Promise.all(
      kicks.map(async (kick) => {
        const UUID = kick.uuid.replace(/-/g, "");
        const { data: usernameData } = await axios.get(
          `https://api.mojang.com/user/profile/${UUID}`
        );

        const kickedAt = await dateFormat(ctx.prisma, kick.time);

        // if removed by uuid exists, then remove by date can be trusted

        return {
          player: usernameData.name,
          moderator: kick.banned_by_name,
          reason: kick.reason.length > 0 ? kick.reason : "No reason specified",
          at: kickedAt,
          allData: kick,
          active: "Inactive",
        };
      })
    );
  }),

  getPlayerKicks: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data: uuidData } = await axios.get(
        `https://api.mojang.com/user/profile/agent/minecraft/name/${input.name}`
      );

      console.log(`getting player (${toProperUUID(uuidData.id)}) kicks`);

      const kicks = await ctx.prisma.litebans_kicks.findMany({
        where: {
          uuid: toProperUUID(uuidData.id),
        },
      });

      return Promise.all(
        kicks.map(async (kick) => {
          // note: if removed by uuid exists, then remove by date can be trusted

          const kickedAt: string = await dateFormat(ctx.prisma, kick.time);

          return {
            player: input.name,
            moderator: kick.banned_by_name,
            reason:
              kick.reason.length > 0 ? kick.reason : "No reason specified",
            at: kickedAt,
            allData: kick,
          };
        })
      );
    }),
});

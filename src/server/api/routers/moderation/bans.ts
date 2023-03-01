import { createTRPCRouter, publicProcedure } from "../../trpc";

import axios from "axios";
import { dateFormat, toProperUUID } from "../../../../utils/general";
import { z } from "zod";

export const banRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.litebans_bans.findMany();
  }),

  parsedData: publicProcedure.query(async ({ ctx }) => {
    const bans = await ctx.prisma.litebans_bans.findMany();

    return Promise.all(
      bans.map(async (ban) => {
        const UUID = ban.uuid.replace(/-/g, "");
        const { data: usernameData } = await axios.get(
          `https://api.mojang.com/user/profile/${UUID}`
        );

        const banDate = await dateFormat(ctx.prisma, ban.time);
        const bannedUntil: string = await dateFormat(ctx.prisma, ban.until);

        // if removed by uuid exists, then remove by date can be trusted

        return {
          player: usernameData.name,
          moderator: ban.banned_by_name,
          reason: ban.reason.length > 0 ? ban.reason : "No reason specified",
          at: banDate,
          until: bannedUntil,
          allData: ban,
          active: ban.active ? "Active" : "Inactive",
        };
      })
    );
  }),

  getPlayerBans: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data: uuidData } = await axios.get(
        `https://api.mojang.com/user/profile/agent/minecraft/name/${input.name}`
      );

      const bans = await ctx.prisma.litebans_bans.findMany({
        where: {
          uuid: toProperUUID(uuidData.id),
        },
      });

      return Promise.all(
        bans.map(async (ban) => {
          // note: if removed by uuid exists, then remove by date can be trusted

          const isPerm = Number(ban.until) === 0;

          const banDate = await dateFormat(ctx.prisma, ban.time);
          const bannedUntil: string = isPerm
            ? "Forever"
            : await dateFormat(ctx.prisma, ban.until);

          return {
            player: input.name,
            moderator: ban.banned_by_name,
            reason: ban.reason.length > 0 ? ban.reason : "No reason specified",
            at: banDate,
            until: bannedUntil,
            allData: ban,
            active: ban.active ? "Active" : "Inactive",
          };
        })
      );
    }),
});

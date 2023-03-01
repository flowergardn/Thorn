import { createTRPCRouter, publicProcedure } from "../../trpc";

import axios from "axios";
import { dateFormat, toProperUUID } from "../../../../utils/general";
import { z } from "zod";
import dayjs from "dayjs";

export const muteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.litebans_mutes.findMany();
  }),

  parsedData: publicProcedure.query(async ({ ctx }) => {
    const mutes = await ctx.prisma.litebans_mutes.findMany();

    return Promise.all(
      mutes.map(async (mute) => {
        const UUID = mute.uuid.replace(/-/g, "");
        const { data: usernameData } = await axios.get(
          `https://api.mojang.com/user/profile/${UUID}`
        );

        const mutedAt = await dateFormat(ctx.prisma, mute.time);
        const mutedUntil: string = await dateFormat(ctx.prisma, mute.until);

        // if removed by uuid exists, then remove by date can be trusted

        return {
          player: usernameData.name,
          moderator: mute.banned_by_name,
          reason: mute.reason.length > 0 ? mute.reason : "No reason specified",
          at: mutedAt,
          until: mutedUntil,
          allData: mute,
          active: "Inactive",
        };
      })
    );
  }),

  getPlayerMutes: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data: uuidData } = await axios.get(
        `https://api.mojang.com/user/profile/agent/minecraft/name/${input.name}`
      );

      console.log(`getting player (${toProperUUID(uuidData.id)}) mutes`);

      const mutes = await ctx.prisma.litebans_mutes.findMany({
        where: {
          uuid: toProperUUID(uuidData.id),
        },
      });

      return Promise.all(
        mutes.map(async (mute) => {
          // note: if removed by uuid exists, then remove by date can be trusted

          const mutedAt: string = await dateFormat(ctx.prisma, mute.time);
          const mutedUntil: string = await dateFormat(ctx.prisma, mute.until);

          // Need to carry this over to bans too.
          // It updates the activity state, which litebans only does on join I presume.

          const now = dayjs().unix() * 1000;

          if (mute.active && mute.until < now) {
            await ctx.prisma.litebans_mutes.update({
              where: {
                id: mute.id,
              },
              data: {
                active: false,
              },
            });
            mute.active = false;
          }

          return {
            player: input.name,
            moderator: mute.banned_by_name,
            reason:
              mute.reason.length > 0 ? mute.reason : "No reason specified",
            at: mutedAt,
            until: mutedUntil,
            allData: mute,
          };
        })
      );
    }),
});

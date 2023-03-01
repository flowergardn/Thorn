import axios from "axios";
import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

var isoWeek = require("dayjs/plugin/isoWeek");
var bigIntSupport = require("dayjs/plugin/bigIntSupport");
dayjs.extend(isoWeek);
dayjs.extend(bigIntSupport);

export const statRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        statistic: z.string().regex(/bans|kicks|mutes/gi),
      })
    )

    // todo: staff leaderboard
    .query(async ({ ctx, input }) => {
      console.log(`Getting statistics for ${input.statistic}`);

      let allModerations: any = [];

      // If you know a better way to do this, send a pr <3
      switch (input.statistic) {
        case "bans": {
          allModerations = await ctx.prisma.litebans_bans.findMany();
          break;
        }
        case "kicks": {
          allModerations = await ctx.prisma.litebans_kicks.findMany();
          break;
        }
        case "mutes": {
          allModerations = await ctx.prisma.litebans_mutes.findMany();
          break;
        }
        // should not happen due to zod checking them before hand
        default: {
        }
      }

      let weekly = 0;
      const total = allModerations.length;

      allModerations.forEach((moderation: any) => {
        // typescript does not agree with day.js plugins
        // i have a plugin to support big numbers, but, typescript believes it doesn't exist
        // then there's isoWeek.

        // @ts-ignore
        const happened = dayjs(moderation.time);
        // @ts-ignore
        const happenedWeek = happened.isoWeek();
        // @ts-ignore
        const nowWeek = dayjs().isoWeek();

        if (happenedWeek === nowWeek) weekly++;
      });

      return {
        weekly,
        total,
      };
    }),

  leaderboard: protectedProcedure.query(async ({ ctx }) => {
    const bans: string[] = (await ctx.prisma.litebans_bans.findMany()).map(
      (x) => x.banned_by_uuid
    );
    const kicks: string[] = (await ctx.prisma.litebans_kicks.findMany()).map(
      (x) => x.banned_by_uuid
    );
    const mutes: string[] = (await ctx.prisma.litebans_mutes.findMany()).map(
      (x) => x.banned_by_uuid
    );

    const all = [...bans, ...kicks, ...mutes];

    const amounts: {
      [key: string]: number;
    } = {};

    all.forEach((a) => {
      if (amounts[a]) return;
      amounts[a] = all.filter((x) => x === a).length;
    });

    const keys = Object.keys(amounts);

    return Promise.all(
      keys.map(async (key) => {
        if (key === "CONSOLE") {
          return {
            name: "Console",
            amount: amounts[key]!!,
            uuid: key,
          };
        }

        const UUID = key.replace(/-/g, "");
        let resp;

        try {
          resp = await axios.get(`https://api.mojang.com/user/profile/${UUID}`);
        } catch (err) {
          console.log(err);
        }

        if (!resp)
          return {
            name: key,
            uuid: key,
            amount: amounts[key]!!,
          };

        return {
          name: resp?.data.name,
          uuid: key,
          amount: amounts[key]!!,
        };
      })
    );
  }),
});

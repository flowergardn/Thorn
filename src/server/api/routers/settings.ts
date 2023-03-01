import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.thorn_settings.findMany();
  }),
  getSetting: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.thorn_settings.findFirst({
        where: {
          name: input.name,
        },
      });
    }),
  isPanelPrivate: publicProcedure.query(async ({ ctx }) => {
    const publicitySetting = await ctx.prisma.thorn_settings.findFirst({
      where: {
        name: "privatePanel",
      },
    });

    if (publicitySetting === null) return false;

    return publicitySetting.value === "true";
  }),
  updateSetting: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const setting = await ctx.prisma.thorn_settings.findFirst({
        where: {
          name: input.name,
        },
      });

      // Create the setting if it doesn't exist
      if (setting === null) {
        return ctx.prisma.thorn_settings.create({
          data: {
            name: input.name,
            value: input.value,
          },
        });
      }

      return ctx.prisma.thorn_settings.update({
        where: {
          id: setting.id,
        },
        data: {
          value: input.value,
        },
      });
    }),
});

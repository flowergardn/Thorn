import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getDiscordId } from "~/utils/general";

export const accountRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.thorn_authorized.findMany();
  }),
  getAllParsed: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.thorn_authorized.findMany();

    return Promise.all(
      accounts.map(async (account) => {
        const UUID = account.minecraftUUID.replace(/-/g, "");

        const { data: usernameData } = await axios.get(
          `https://api.mojang.com/user/profile/${UUID}`
        );

        const { data: discordData } = await axios.get(
          `https://discord.com/api/v10/users/${account.discordId}`,
          {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
          }
        );

        return {
          minecraft: {
            name: usernameData.name,
            uuid: account.minecraftUUID,
            avatar: `https://skins.mcstats.com/bust/${account.minecraftUUID}`,
          },
          discord: {
            id: account.discordId,
            username: discordData.username,
            discriminator: discordData.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${account.discordId}/${discordData.avatar}.png`,
          },
        };
      })
    );
  }),
  createAccount: protectedProcedure
    .input(
      z.object({
        minecraftUUID: z.string(),
        discordId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const executor = await getDiscordId(ctx.prisma, ctx.session.user.id);

      // this should __never__ happen (due to it being a protected procedure)
      // but typescript doesn't know that
      if (!executor) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      // Only the admin can add a Thorn user
      if (process.env.ADMIN_DISCORD_ID != executor) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      await ctx.prisma.thorn_authorized.create({
        data: {
          discordId: input.discordId,
          minecraftUUID: input.minecraftUUID,
          authorizedBy: executor,
        },
      });
    }),
  deleteAccount: protectedProcedure
    .input(
      z.object({
        discordId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = await getDiscordId(ctx.prisma, ctx.session.user.id);

      if (process.env.ADMIN_DISCORD_ID != userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const userToDelete = await ctx.prisma.account.findFirst({
        where: {
          providerAccountId: input.discordId,
        },
      });

      if (!userToDelete) return;

      // Delete their user
      // Thanks to it being relational, this also revokes all of their sessions.
      await ctx.prisma.user.delete({
        where: {
          id: userToDelete.userId,
        },
      });

      // Finally, remove them from the list of authorized users.

      return await ctx.prisma.thorn_authorized.delete({
        where: {
          discordId: input.discordId,
        },
      });
    }),
});

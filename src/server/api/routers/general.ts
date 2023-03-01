import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getDiscordId } from "~/utils/general";

interface IDiscord {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  banner?: string;
  accent_color?: number;
  premium_type?: number;
  public_flags?: number;
}

export const generalRouter = createTRPCRouter({
  getDiscordID: protectedProcedure.query(async ({ ctx }) => {
    return await getDiscordId(ctx.prisma, ctx.session.user.id);
  }),
  getDiscordInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!user) return null;

    const resp = await axios.get("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });

    return <IDiscord>resp.data;
  }),
});

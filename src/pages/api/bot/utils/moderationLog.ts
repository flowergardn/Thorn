import {
  EmbedBuilder,
  inlineCode,
  TimestampStyles,
  time,
} from "@discordjs/builders";
import { litebans_bans } from "@prisma/client";
import { APIEmbed, APIEmbedField } from "discord-api-types/v10";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { captialize } from "~/utils/general";
import getConfig from "next/config";
import dayjs from "dayjs";
import Punishment from "~/interfaces/Punishment";

const {
  publicRuntimeConfig: nextConf,
}: {
  publicRuntimeConfig: {
    version: string;
  };
} = getConfig();

function parseColor(color: string) {
  let baseColor = color;
  baseColor = color.replace("#", "");
  return parseInt(baseColor, 16);
}

export const getModerationLog = async (
  type: string,
  player: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<APIEmbed | null> => {
  const ctx = await createTRPCContext({ req, res });
  const trpc = appRouter.createCaller(ctx);

  let moderations: any = [];

  switch (type) {
    case "bans": {
      moderations = await trpc.bans.getPlayerBans({
        name: player,
      });
      break;
    }
    case "kicks": {
      moderations = await trpc.kicks.getPlayerKicks({
        name: player,
      });
      break;
    }
    case "mutes": {
      moderations = await trpc.mutes.getPlayerMutes({
        name: player,
      });
      break;
    }
    default: {
      // returns null
      break;
    }
  }

  if (!moderations || moderations.length === 0) {
    console.log(`No moderations for ${type}, returning null.`, moderations);
    return null;
  }

  const embed = new EmbedBuilder().setColor(parseColor("#ffaec8"));
  embed.setAuthor({
    name: `${captialize(type)} for ${player}`,
  });
  embed.setThumbnail(
    `https://skins.mcstats.com/skull/${moderations[0]!!.allData.uuid}`
  );

  let fields: APIEmbedField[] = [];

  moderations.forEach((punishment: Punishment) => {
    const happenedAt = time(
      Math.round(Number(punishment.allData.time) / 1000),
      TimestampStyles.LongDateTime
    );

    const expiresAt = time(
      Math.round(Number(punishment.allData.until) / 1000),
      TimestampStyles.RelativeTime
    );

    const removedAt = time(
      dayjs(punishment.allData.removed_by_date).unix(),
      TimestampStyles.RelativeTime
    );

    const active = punishment.allData.active;
    const emoji = active ? "✅" : "❎";

    // Checks if a punishment was removed prematurely.
    const removedPM = () => {
      const greaterThanNow = punishment.allData.until > dayjs().unix();
      const isTrusted = punishment.allData.removed_by_uuid !== null;
      return greaterThanNow && !active && isTrusted;
    };

    let description = [
      `${happenedAt} • #${punishment.allData.id}`,
      `**Reason:** ${inlineCode(punishment.reason)}`,
      `**Punisher:** ${inlineCode(punishment.moderator)}`,
    ];

    // Kicks can't be "active", or have durations; so there's no sense in adding those.
    if (type !== "kicks") {
      // If the moderation is not permenant.
      if (Number(punishment.allData.until) !== 0) {
        // adds the expired date if the punishment was not removed prematurely.
        // if it was, then it adds the date of removal.

        // this is useful so you won't have an expiration date in the future, whilst it being inactive.

        description.push(`**Expires:** ${removedPM() ? removedAt : expiresAt}`);
      } else description.push(`**Duration:** ${inlineCode("Lifetime")}`);

      description.push(`**Active:** ${emoji}`);
    }

    fields.push({
      name: "‎",
      value: description.join("\n"),
    });
  });

  if (fields.length > 25) fields.length = 25;

  embed.setFields(fields);

  embed.setFooter({
    text: `Thorn v${nextConf.version} | Made with ❤`,
  });

  return embed.toJSON();
};

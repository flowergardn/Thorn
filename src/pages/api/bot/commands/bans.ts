import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { NextApiRequest, NextApiResponse } from "next";
import Interaction from "~/interfaces/Interaction";
import { getArgument } from "../utils/general";
import { getModerationLog } from "../utils/moderationLog";

export const execute = async (opt: {
  res: NextApiResponse;
  req: NextApiRequest;
  interaction: Interaction;
}) => {
  // Player is a required argument, so it should always be provided.
  const player = getArgument(opt.interaction, "player")?.value;

  const embed = await getModerationLog("bans", player!!, opt.req, opt.res);

  // todo: send error
  if (!embed) return;

  opt.res.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    },
  });
};

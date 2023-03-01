import type { NextApiRequest, NextApiResponse } from "next";

import { InteractionType } from "discord-api-types/v10";
import checkRequest from "~/utils/discordRequest";

const bot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.body;

  const isVerified = checkRequest(req);

  if(!isVerified) {
    res.status(401)
    res.send("Bad request.")
    return
  }

  // ACK pings
  if (type === 1) {
    res.json({ type: 1 });
    return;
  }

  if (type === InteractionType.ApplicationCommand) {
    const interaction = req.body;

    try {
      const command = await import(`../bot/commands/${interaction.data.name}`);
      await command.execute({
        interaction,
        res,
        req,
      });
    } catch (err: any) {
      console.log(err.message);
      console.log(`command does not exist`);
    }
  }
};

export default bot;

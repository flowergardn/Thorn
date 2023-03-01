import { litebans_bans } from "@prisma/client";

export default interface Punishment {
    allData: litebans_bans;
    player: string;
    moderator: string;
    reason: string;
    bannedAt: string;
    active: string;
  }
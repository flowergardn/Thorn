import { createTRPCRouter } from "~/server/api/trpc";
import { generalRouter } from "~/server/api/routers/general";
import { banRouter } from "./routers/moderation/bans";
import { accountRouter } from "./routers/accounts";
import { settingsRouter } from "./routers/settings";
import { kickRouter } from "./routers/moderation/kicks";
import { muteRouter } from "./routers/moderation/mutes";
import { statRouter } from "./routers/moderation/statistics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  general: generalRouter,
  settings: settingsRouter,
  accounts: accountRouter,
  bans: banRouter,
  kicks: kickRouter,
  mutes: muteRouter,
  statistics: statRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

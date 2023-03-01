import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  responseMeta({ ctx, paths, type, errors }) {
    const cached = ["stats"];

    // assuming you have all your public routes with the keyword `public` in them
    const cacheable = paths && paths.every((path) => cached.includes(path));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === "query";
    if (ctx?.req && cacheable && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      const TWO_MINUTES = 12;
      return {
        headers: {
          "cache-control": `s-maxage=1, stale-while-revalidate=${TWO_MINUTES}`,
        },
      };
    }
    return {};
  },
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

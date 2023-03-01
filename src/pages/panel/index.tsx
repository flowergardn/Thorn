import { type NextPage } from "next";
import Leaderboard from "~/components/panel/leaderboard/Leaderboard";
import Shell from "~/components/panel/Shell";
import Statistics from "~/components/panel/statistics/Statistics";

const Panel: NextPage = () => {
  return (
    <Shell>
      <Statistics />
      <Leaderboard />
    </Shell>
  );
};

export default Panel;

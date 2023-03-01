import { Text, Select, Grid, Skeleton } from "@mantine/core";
import { IconBan } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "~/utils/api";
import StatisticCard from "./StatisticCard";

const Statistics = () => {
  const [statisticType, setStatisticType] = useState<string | null>("bans");

  const { data, isLoading, isError, error } = api.statistics.get.useQuery({
    statistic: statisticType ?? "bans",
  });

  const visibleSkeleton = isLoading || isError;

  return (
    <>
      <div className="mb-4 md:mr-[80%]">
        <Text size="lg">Your server statistics</Text>
        <Select
          placeholder="Pick a statistic"
          className="mt-2 md:mr-[50%]"
          value={statisticType}
          onChange={setStatisticType}
          data={[
            { value: "bans", label: "Bans" },
            { value: "mutes", label: "Mutes" },
            { value: "kicks", label: "Kicks" },
          ]}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-4 flex-wrap md:col-span-1">
          <Skeleton visible={visibleSkeleton}>
            <StatisticCard
              icon={<IconBan />}
              text={`${data?.weekly.toLocaleString(
                "en-US"
              )} ${statisticType} this week`}
            />
          </Skeleton>
        </div>
        <div className="col-span-4 flex-wrap md:col-span-1">
          <Skeleton visible={visibleSkeleton}>
            <StatisticCard
              icon={<IconBan />}
              text={`${data?.total.toLocaleString(
                "en-US"
              )} total ${statisticType}`}
            />
          </Skeleton>
        </div>
      </div>
    </>
  );
};

export default Statistics;

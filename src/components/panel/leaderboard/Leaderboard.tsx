import {
  Avatar,
  Box,
  Group,
  useMantineTheme,
  Text,
  Skeleton,
} from "@mantine/core";
import { api } from "~/utils/api";
import { v4 } from "uuid";

const Leaderboard = () => {
  const { data, isLoading, isError } = api.statistics.leaderboard.useQuery();

  const User = (props: {
    entry: {
      name: string;
      amount: number;
      uuid: string;
    };
  }) => {
    const theme = useMantineTheme();

    let { uuid } = props.entry;

    if (uuid === "CONSOLE") uuid = "f78a4d8dd51b4b3998a3230f2de0c670";

    return (
      <>
        <Box
          sx={{
            paddingTop: theme.spacing.sm,
          }}
        >
          <Group>
            <Avatar
              src={`https://skins.mcstats.com/bust/${uuid}`}
              radius="xl"
            />
            <Box sx={{ flex: 1 }}>
              <Text size="md" weight={500}>
                {props.entry.name}
              </Text>
              <Text color="dimmed" size="xs">
                {props.entry.amount} moderations
              </Text>
            </Box>
          </Group>
        </Box>
      </>
    );
  };

  if (isLoading || isError) {
    return <Skeleton visible={true} />;
  }

  data.length = 3;

  return (
    <>
      <div className="mb-4 mt-4 md:mr-[60%]">
        <Text size="lg">All-time top moderators</Text>
        {data.map((a) => {
          return <User entry={a} key={v4()} />;
        })}
      </div>
    </>
  );
};

export default Leaderboard;

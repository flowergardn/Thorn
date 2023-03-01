import React from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
  Popover,
  Button,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { IconLogout } from "@tabler/icons-react";
import Loading from "../Loader";

export function User() {
  const theme = useMantineTheme();
  const { status, data: session } = useSession();

  if (status === "loading") return <></>;

  const { data, isLoading } = api.general.getDiscordInfo.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  if (isLoading || !data) return <Loading />;

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Popover width="target" position="bottom" withArrow shadow="md">
        <Popover.Target>
          <UnstyledButton
            sx={{
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
            }}
          >
            <Group>
              <Avatar
                src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=80`}
                radius="xl"
              />
              <Box sx={{ flex: 1 }}>
                <Text size="md" weight={500}>
                  {data.username}
                </Text>
                <Text color="dimmed" size="xs">
                  {data.username}#{data.discriminator}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
          <Button
            leftIcon={<IconLogout />}
            variant="outline"
            color="red"
            fullWidth
            onClick={() => {
              signOut();
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}

import { NextPage } from "next";
import {
  Text,
  Box,
  useMantineTheme,
  Group,
  Avatar,
  Button,
} from "@mantine/core";
import Shell from "~/components/panel/Shell";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import AddAccount from "~/components/panel/AddAccount";
import { api } from "~/utils/api";
import { showNotification } from "@mantine/notifications";
import { getError } from "~/utils/general";
import { signOut } from "next-auth/react";
import { v4 } from "uuid";

interface Account {
  minecraft: {
    name: string;
    uuid: string;
    avatar: string;
  };
  discord: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
}

// TODO: Make this update on add / delete.
// Not so sure how I would do that.

const User = (props: { account: Account }) => {
  const theme = useMantineTheme();
  const deleteAccount = api.accounts.deleteAccount.useMutation();

  return (
    <>
      <Box
        sx={{
          paddingTop: theme.spacing.sm,
        }}
      >
        <Group>
          <Avatar src={props.account.minecraft.avatar} radius="xl" />
          <Box sx={{ flex: 1 }}>
            <Text size="md" weight={500}>
              {props.account.minecraft.name}
            </Text>
            <Text color="dimmed" size="xs">
              {props.account.discord.username}#
              {props.account.discord.discriminator}
            </Text>
          </Box>
          <Button
            leftIcon={<IconTrash />}
            variant="outline"
            loading={deleteAccount.isLoading}
            color="red"
            onClick={async () => {
              await deleteAccount.mutate({
                discordId: props.account.discord.id,
              });
            }}
          >
            Remove
          </Button>
        </Group>
      </Box>
    </>
  );
};

const AccountList = (): JSX.Element => {
  const allAccounts = api.accounts.getAllParsed.useQuery();

  if (allAccounts.isLoading) return <></>;
  if (allAccounts.isError) {
    showNotification({
      color: "red",
      title: "Uh oh!",
      message: getError(allAccounts.error.message),
    });

    if (allAccounts.error.message === "UNAUTHORIZED") signOut();

    return <></>;
  }

  return (
    <>
      {allAccounts.data.map((account) => {
        return <User account={account} key={v4()} />;
      })}
    </>
  );
};

const Accounts: NextPage = () => {
  const [opened, setOpened] = useState(false);

  return (
    <Shell>
      <div className="mb-4 md:mr-[80%]">
        <Text size="lg">Manage Thorn accounts</Text>
        <AddAccount open={opened} setOpen={setOpened} />
        <div className="mt-2 mb-2">
          <Button
            variant="outline"
            leftIcon={<IconPlus />}
            onClick={() => setOpened(!opened)}
          >
            Add
          </Button>
        </div>
        <AccountList />
      </div>
    </Shell>
  );
};
export default Accounts;

import { useEffect, useState } from "react";
import {
  createStyles,
  Container,
  Group,
  Tabs,
  Burger,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.dark[7],
    borderBottom: `1px solid transparent`,
    marginBottom: 120,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.colors.dark[8],
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",
    color: theme.colors.gray[3],

    "&[data-active]": {
      borderColor: theme.colors.dark[7],
    },
  },
}));

interface HeaderTabsProps {
  tabs: string[];
  currentPage: string;
}

export function Header({ tabs, currentPage }: HeaderTabsProps) {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [page, setPage] = useState(currentPage);

  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: privatePanel, isLoading } =
    api.settings.isPanelPrivate.useQuery();

  useEffect(() => {
    if (!isLoading && privatePanel && !sessionData)
      window.location.href = "/private";
  }, [isLoading]);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Text className="text-white">Thorn</Text>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </Group>
      </Container>
      <Container>
        <Tabs
          defaultValue={page}
          variant="outline"
          value={page}
          onTabChange={(value) => {
            if (!value) return;
            setPage(value);
            router.push(value === "Home" ? "/" : `/${value.toLowerCase()}`);
          }}
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}

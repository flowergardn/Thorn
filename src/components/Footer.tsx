import { createStyles, Group, ActionIcon, Text } from "@mantine/core";
import { IconBrandDiscord, IconBrandGithub } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Would like it if you *did not* remove the Thorn branding / links from here 💜

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid #18181b`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },
}));

export function Footer() {
  const { classes } = useStyles();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (window.location.pathname.includes("/panel")) setShow(false);
  }, []);

  if (!show) return <></>;

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Text>Thorn</Text>

        <Group spacing="xs" position="right" noWrap>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandDiscord size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}

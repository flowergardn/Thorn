import React from "react";
import {
  IconAdjustmentsAlt,
  IconUsers,
  IconHome,
} from "@tabler/icons-react";
import {
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  MantineColor,
} from "@mantine/core";
import { useRouter } from "next/router";

interface MainLink {
  icon: React.ReactNode;
  color: MantineColor;
  label: string;
  link: string;
}

type MainLinkProps = MainLink & {
  open: boolean;
  setOpen: (arg0: boolean) => void;
};

function MainLink({
  icon,
  color,
  label,
  link,
  open,
  setOpen,
}: MainLinkProps) {
  const router = useRouter();

  return (
    <UnstyledButton
      onClick={() => {
        // closes the navbar when a button is clicked (on mobile devices)
        if (open) setOpen(false);

        void router.push(link, undefined, { shallow: true });
      }}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data: MainLink[] = [
  {
    icon: <IconHome size={16} />,
    color: "gray.3",
    label: "Home",
    link: "/panel",
  },
  {
    icon: <IconAdjustmentsAlt size={16} />,
    color: "gray.3",
    label: "Settings",
    link: "/panel/settings",
  },
  {
    icon: <IconUsers size={16} />,
    color: "gray.3",
    label: "Accounts",
    link: "/panel/accounts",
  },
];

export function Buttons({
  opened,
  setOpen,
}: {
  opened: boolean;
  setOpen: (arg0: boolean) => void;
}) {
  const links = data.map((link) => (
    <MainLink {...link} open={opened} setOpen={setOpen} key={link.label} />
  ));
  return <div>{links}</div>;
}

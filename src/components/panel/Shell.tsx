import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoadingCenter from "~/components/Loader";
import { Buttons } from "~/components/panel/Buttons";
import { User } from "~/components/panel/User";

const Shell = (props: { children: React.ReactNode }) => {
  const { status } = useSession();
  const theme = useMantineTheme();
  const [isNavbarOpened, setIsNavbarOpened] = useState(false);

  if (status === "loading") return <LoadingCenter />;

  if (status === "unauthenticated") {
    window.location.href = "/";
    // return early to prevent ANY data from being sent
    return <></>;
  }

  return (
    <>
      <AppShell
        styles={{
          main: {
            background: theme.colors.dark[8],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!isNavbarOpened}
            width={{ sm: 200, lg: 200 }}
          >
            <Navbar.Section grow mt="xs">
              <Buttons opened={isNavbarOpened} setOpen={setIsNavbarOpened} />
            </Navbar.Section>
            <Navbar.Section>
              <User />
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={isNavbarOpened}
                  onClick={() => setIsNavbarOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text>Thorn</Text>
            </div>
          </Header>
        }
      >
        {props.children}
      </AppShell>
    </>
  );
};

export default Shell;

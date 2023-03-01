import { type NextPage } from "next";
import { Button, Text, Title } from "@mantine/core";
import { Header } from "../components/Header";
import Center from "../components/Center";
import { useRouter } from "next/router";
import { useOs } from "@mantine/hooks";
import Login from "~/components/Login";

const Home: NextPage = () => {
  const router = useRouter();
  const os = useOs();

  if (os === "android" || os === "ios") {
    return (
      <>
        <div className="h-screen bg-zinc-900">
          <Title ta="center" className="mb-4">
            Thorn
          </Title>
          <Text ta="center" className="mb-4">
            Sadly, mobile devices aren&lsquo;t supported at this time. However, you
            can use the Discord bot!
          </Text>
          <Login />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-screen bg-zinc-900">
        <Header tabs={["Home", "Bans", "Kicks", "Mutes"]} currentPage="Home" />
        <Text ta="center" className="mb-4">
          Select a thing to view
        </Text>
        <Center>
          <Button.Group orientation="vertical">
            <Button
              variant="default"
              onClick={() => {
                router.push("/bans");
              }}
            >
              Bans
            </Button>
            <Button
              variant="default"
              onClick={() => {
                router.push("/mutes");
              }}
            >
              Mutes
            </Button>
            <Button
              variant="default"
              onClick={() => {
                router.push("/kicks");
              }}
            >
              Kicks
            </Button>
          </Button.Group>
        </Center>
        <Login />
      </div>
    </>
  );
};

export default Home;

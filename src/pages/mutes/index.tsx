import { type NextPage } from "next";

import { LoadingOverlay, Text } from "@mantine/core";
import { Header } from "../../components/Header";
import Center from "../../components/Center";
import { PlayerTable } from "../../components/PlayerTable";
import { api } from "../../utils/api";

const Mutes: NextPage = () => {
  const muteData = api.mutes.parsedData.useQuery();

  const Loader = () => {
    if (!muteData.isLoading) return <></>;

    return (
      <Center>
        <LoadingOverlay visible={true} />
      </Center>
    );
  };

  const Page = () => {
    if (muteData.isLoading || !muteData.data) return <></>;

    return (
      <>
        <div className="ml-20 mb-4">
          <Text size={"xl"}>Viewing mute data</Text>
        </div>
        <Center>
          <div className="mx-20">{<PlayerTable data={muteData.data} type="mutes" />}</div>
        </Center>
      </>
    );
  };

  return (
    <>
      <div className="h-screen bg-zinc-900">
        <Header tabs={["Home", "Bans", "Kicks", "Mutes"]} currentPage="Mutes" />
        {muteData.isLoading ? <Loader /> : <Page />}
      </div>
    </>
  );
};

export default Mutes;

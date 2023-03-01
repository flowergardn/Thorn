import { type NextPage } from "next";

import { LoadingOverlay, Text } from "@mantine/core";
import { Header } from "../../components/Header";
import Center from "../../components/Center";
import { PlayerTable } from "../../components/PlayerTable";
import { api } from "../../utils/api";

const Kicks: NextPage = () => {
  const kickData = api.kicks.parsedData.useQuery();

  const Loader = () => {
    if (!kickData.isLoading) return <></>;

    return (
      <Center>
        <LoadingOverlay visible={true} />
      </Center>
    );
  };

  const Page = () => {
    if (kickData.isLoading || !kickData.data) return <></>;

    return (
      <>
        <div className="ml-20 mb-4">
          <Text size={"xl"}>Viewing kick data</Text>
        </div>
        <Center>
          <div className="mx-20">{<PlayerTable data={kickData.data} type="kicks" />}</div>
        </Center>
      </>
    );
  };

  return (
    <>
      <div className="h-screen bg-zinc-900">
        <Header tabs={["Home", "Bans", "Kicks", "Mutes"]} currentPage="Kicks" />
        {kickData.isLoading ? <Loader /> : <Page />}
      </div>
    </>
  );
};

export default Kicks;

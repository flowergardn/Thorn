import { type NextPage } from "next";

import { LoadingOverlay, Text } from "@mantine/core";
import { Header } from "../../components/Header";
import Center from "../../components/Center";
import { PlayerTable } from "../../components/PlayerTable";
import { api } from "../../utils/api";

const Bans: NextPage = () => {
  const banData = api.bans.parsedData.useQuery();

  const Loader = () => {
    if (!banData.isLoading) return <></>;

    return (
      <Center>
        <LoadingOverlay visible={true} />
      </Center>
    );
  };

  const Page = () => {
    if (banData.isLoading || !banData.data) return <></>;

    return (
      <>
        <div className="ml-20 mb-4">
          <Text size={"xl"}>Viewing ban data</Text>
        </div>
        <Center>
          <div className="mx-20">
            {<PlayerTable data={banData.data} type="bans" />}
          </div>
        </Center>
      </>
    );
  };

  return (
    <>
      <div className="h-screen bg-zinc-900">
        <Header tabs={["Home", "Bans", "Kicks", "Mutes"]} currentPage="Bans" />
        {banData.isLoading ? <Loader /> : <Page />}
      </div>
    </>
  );
};

export default Bans;

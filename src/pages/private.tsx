import { Text, Title } from "@mantine/core";
import { type NextPage } from "next";
import Login from "~/components/Login";

const Private: NextPage = () => {
  return (
    <>
      <div className="h-screen bg-zinc-900">
        <Title ta="center" className="mb-4">
          Thorn
        </Title>
        <Text ta="center" className="mb-1">
          Unfortunately, the owner of this panel has disabled public usage.
        </Text>
        <Text ta="center" className="mb-4">
          Contact them if you believe this is a mistake.
        </Text>
        <Login />
      </div>
    </>
  );
};

export default Private;

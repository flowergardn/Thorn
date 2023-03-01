import { Button } from "@mantine/core";
import Center from "../components/Center";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const { data: sessionData } = useSession();
  let action = sessionData ? "Staff Panel" : "Login";

  return (
    <>
      <Center classes="mt-5">
        <Button
          onClick={() => {
            if (sessionData) window.location.href = "/panel";
            else signIn("discord");
          }}
        >
          {action}
        </Button>
      </Center>
    </>
  );
};

export default Login;

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, TextInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NIL as NIL_UUID } from "uuid";
import { isSnowflake } from "discord-snowflake";
import { api } from "~/utils/api";
import { showNotification } from "@mantine/notifications";
import { getError } from "~/utils/general";

const AddAccount = (props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const createAccount = api.accounts.createAccount.useMutation();
  const [shownError, setShownError] = useState(false);

  const checkId = (id: any) => {
    const isNumeric = /^[0-9]{1,}$/.test(id);
    if (!isNumeric) return false;
    return isSnowflake(id);
  };

  const form = useForm({
    initialValues: {
      uuid: "",
      discordId: "",
    },

    validate: {
      uuid: (value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
          value
        )
          ? null
          : "Invalid UUID; Thorn requires the dashed version.",
      discordId: (value) => (checkId(value) ? null : "Invalid Discord ID."),
    },
  });

  useEffect(() => {
    if (!createAccount.isLoading && props.open) {
      props.setOpen(false);
      form.setFieldValue("uuid", "");
      form.setFieldValue("discordId", "");
    }
  }, [createAccount.isLoading]);

  useEffect(() => {
    if (!createAccount.isError || shownError) return;

    let error = createAccount.error.message;

    if (error.includes("Unique constraint failed")) {
      error = "An account already exists with the provided Discord account";
    } else error = getError(error);

    showNotification({
      color: "red",
      title: "Uh oh!",
      message: error,
    });

    setShownError(true);
  }, [createAccount.isError]);

  return (
    <>
      <Modal
        centered
        opened={props.open}
        onClose={() => props.setOpen(false)}
        title="Add an account"
      >
        <form
          onSubmit={form.onSubmit(async (values) => {
            await createAccount.mutate({
              discordId: values.discordId,
              minecraftUUID: values.uuid,
            });
          })}
        >
          <TextInput
            withAsterisk
            label="Minecraft UUID"
            className="my-4"
            placeholder={NIL_UUID}
            {...form.getInputProps("uuid")}
          />
          <TextInput
            withAsterisk
            label="Discord ID"
            className="my-4"
            placeholder={"00000000000000000"}
            {...form.getInputProps("discordId")}
          />

          <Group position="right" mt="md">
            <Button type="submit" loading={createAccount.isLoading}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default AddAccount;

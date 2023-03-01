import { NextPage } from "next";
import {
  Text,
  Box,
  useMantineTheme,
  Group,
  Button,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Shell from "~/components/panel/Shell";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { string } from "zod";

const Settings: NextPage = () => {
  const theme = useMantineTheme();

  const { data: settings, isLoading: loadingSettings } =
    api.settings.getAll.useQuery();

  const form = useForm({
    initialValues: {
      dateFormat: "",
      privatePanel: false,
    },
  });

  useEffect(() => {
    if (!loadingSettings && settings) {
      settings.forEach((setting) => {
        console.log(setting.value)
        if (setting.value === "true" || setting.value === "false") {
          form.setFieldValue(setting.name, setting.value === "true");
        } else {
          form.setFieldValue(setting.name, setting.value);
        }
      });
    }
  }, [loadingSettings]);

  const updateSetting = api.settings.updateSetting.useMutation();

  return (
    <Shell>
      <div className="mb-4 md:mr-[80%]">
        <Text size="lg">Manage Thorn settings</Text>

        <Box
          sx={{
            paddingTop: theme.spacing.sm,
          }}
        >
          <form
            onSubmit={form.onSubmit(async (values) => {
              Object.keys(values).forEach((key) => {
                updateSetting.mutate({
                  name: key,
                  value: String(values[key as keyof typeof string]),
                });
              });
            })}
          >
            <Group>
              <TextInput
                label="Date format"
                className="my-4"
                {...form.getInputProps("dateFormat")}
              />
            </Group>
            <Group>
              <Checkbox
                mt="md"
                label="Make moderation panel private"
                {...form.getInputProps("privatePanel", { type: "checkbox" })}
              />
            </Group>
            <Group mt="md">
              <Button
                type="submit"
                variant="outline"
                loading={updateSetting.isLoading}
              >
                Save
              </Button>
            </Group>
          </form>
        </Box>
      </div>
    </Shell>
  );
};
export default Settings;

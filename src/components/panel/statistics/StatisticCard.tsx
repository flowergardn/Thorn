import { Card, Group, Text, ThemeIcon, MantineColor } from "@mantine/core";

const StatisticCard = (props: {
  icon: React.ReactNode;
  text: React.ReactNode | string;
  color?: MantineColor;
}) => {
  return (
    <>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group>
          <ThemeIcon color={props.color ?? "green"} variant="light" size={"xl"} radius="lg">
            {props.icon}
          </ThemeIcon>
          <Text>{props.text}</Text>
        </Group>
      </Card>
    </>
  );
};

export default StatisticCard;

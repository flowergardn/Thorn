import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Chip,
  Tooltip,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import { v4 } from "uuid";
import { getDays } from "~/utils/general";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface RowData {
  player: string;
  moderator: string;
  reason: string;
  at: string;
  until?: string;
  allData: {
    time: any;
    until: any;
  };
  active: string;
}

interface TableSortProps {
  data: RowData[];
  type: "bans" | "mutes" | "kicks";
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const isString = (v: any) => {
  return typeof v === "string" || v instanceof String;
};

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some(
      (key: "player" | "moderator" | "reason" | "at") =>
        isString(item[key]) && item[key].toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    // @ts-ignore
    [...data].sort((a, b) => {
      if (!isString(b[sortBy]) || !isString(a[sortBy])) return [];

      let _a = a[sortBy] as string;
      let _b = b[sortBy] as string;

      if (payload.reversed) return _b.localeCompare(_a);

      return _a.localeCompare(_b);
    }),
    payload.search
  );
}

export function PlayerTable({ data, type }: TableSortProps) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => {
    const active = !!row.active && row.active === "Active";

    const Duration = () => {
      const isMute = type === "mutes";
      const days = getDays(row.allData.until);

      const past = days.includes("ago");

      if (!active && !isMute) return <></>;

      return (
        <Tooltip label={row.until} position="left" radius="md" offset={12}>
          <Text>
            Expire{past ? "d" : "s"} {getDays(row.allData.until)}
          </Text>
        </Tooltip>
      );
    };

    return (
      <tr key={v4()}>
        <td>{row.player}</td>
        <td>{row.moderator}</td>
        <td>{row.reason}</td>
        <td>
          <>
            <Tooltip label={row.at} position="left" radius="md" offset={12}>
              <Text> Happened {getDays(row.allData.time)}</Text>
            </Tooltip>
            <Duration />
          </>
        </td>
        <td>
          <Chip checked={true} color={active ? "red" : "green"}>
            {row.active}
          </Chip>
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "player"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("player")}
            >
              Player
            </Th>
            <Th
              sorted={sortBy === "moderator"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("moderator")}
            >
              Moderator
            </Th>
            <Th
              sorted={sortBy === "reason"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("reason")}
            >
              Reason
            </Th>
            <Th
              sorted={sortBy === "at"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("at")}
            >
              Date
            </Th>
            <Th
              sorted={sortBy === "active"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("active")}
            >
              Status
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0] ?? []).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

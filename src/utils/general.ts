import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

async function getDateFormat(prisma: PrismaClient): Promise<string> {
  const dateFormatSetting = await prisma.thorn_settings.findFirst({
    where: {
      name: "dateFormat",
    },
  });

  let dateFormat = "";

  if (!dateFormatSetting) {
    const defaultFormat = "MM/DD/YYYY HH:mm";
    await prisma.thorn_settings.create({
      data: {
        name: "dateFormat",
        value: defaultFormat,
      },
    });
    dateFormat = defaultFormat;
  } else dateFormat = dateFormatSetting.value;

  return dateFormat;
}

export const dateFormat = async (
  prisma: PrismaClient,
  time: bigint
): Promise<string> => {
  if (Number(time) === 0) return "Forever";

  // @ts-ignore - typescript doesn't like dayjs extensions
  const tz = dayjs.tz.guess();

  // secondary timezone variable which cleans it up a bit
  // ex: New York over America/New_York
  const tz2 = tz.split("/")[1].replace(/_/, " ");

  let format = await getDateFormat(prisma);

  format = format.replace(/{tz}/, tz).replace(/{tz2}/, tz2);

  return dayjs(Number(time)).format(format);
};

export const getDays = (time: bigint): string => {
  if (Number(time) === 0) return "Forever";

  // @ts-ignore
  return dayjs(Number(time)).from(dayjs());
};

export function captialize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toProperUUID(string: string) {
  let uuid = string.split("");
  uuid.splice(8, 0, "-");
  uuid.splice(13, 0, "-");
  uuid.splice(18, 0, "-");
  uuid.splice(23, 0, "-");
  return uuid.join("");
}

export async function getDiscordId(prisma: PrismaClient, userId: string) {
  const user = await prisma.account.findFirst({
    where: {
      userId,
    },
  });

  if (!user) return null;

  return user.providerAccountId;
}

enum StatusCodes {
  UNAUTHORIZED = "You don't have access to this data.",
  FORBIDDEN = "You're not permitted to do that.",
}

export const getError = (code: string) =>
  StatusCodes[code as keyof typeof StatusCodes] ??
  `No description found for ${code}`;

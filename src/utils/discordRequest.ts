import { NextApiRequest } from "next";
import { sign } from "tweetnacl";

export default function checkRequest(req: NextApiRequest): Boolean {
  const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  // If neither are provided, something is up.
  if (!signature || !timestamp) return false;

  // I am way too lazy to fix the issues with buffers, so that's why there is some @ts-ignore below.
  // Feel free to remove it and PR the fix :)
  const isVerified = sign.detached.verify(
    Buffer.from(timestamp + JSON.stringify(req.body)),
    // @ts-ignore
    Buffer.from(signature, "hex"),
    // @ts-ignore
    Buffer.from(PUBLIC_KEY, "hex")
  );

  return isVerified;
}

import { useEffect, useState } from "react";

let defaults = {
  title: "Thorn",
  description: "Minecraft moderation panel",
  color: "#ebdbeb",
};

export default function Meta({
  color = defaults.color,
  description = defaults.description,
  title = defaults.title,
}) {
  const [url, setURL] = useState("");

  useEffect(() => {
    setURL(window.location.host);
  }, []);

  return (
    <>
      <meta name="description" content={description ?? defaults.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="theme-color" content={color ?? defaults.color} />
      <meta property="og:title" content={title ?? defaults.title} />
      <meta
        property="og:description"
        content={description ?? defaults.description}
      />
      <meta property="twitter:domain" content={url} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title ?? defaults.title} />
      <meta
        name="twitter:description"
        content={description ?? defaults.description}
      />
      <link rel="icon" href="/favicon.ico" />
      <title>{title ?? defaults.title}</title>
    </>
  );
}

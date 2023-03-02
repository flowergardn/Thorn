# Thorn

A Minecraft moderation panel for server owners.

## Preparing LiteBans

Thorn requires an SQL database to function, so if you already have one set up, you can skip to the next section.

1. Obtaining an SQL database is quite simple. With the help of [Planetscale](https://planetscale.com/), you can create an account and get a free database with 5 gigabytes of storage.
2. Now, put the connection information into `plugins/LiteBans/config.yml` then change the driver to `MySQL`, and you're done 🎉

## First time setup

We recommend creating a fork of Thorn, rather than cloning, as it saves the time of creating your own repository. (It also lets you update Thorn very quickly)

```bash
# Clone your fork
git clone https://github.com/[your username]/Thorn
# Go to the project directory
cd Thorn
# Install dependencies
npm install
```

After all that, copy `.env.example` into `.env`, and fill it accordingly.
Then, migrate your database using:

```bash
npx prisma db push
```

After that, if you want to use the Discord bot, do:

```bash
npm run register
```

This will register the bot commands for your bot.

## Deployment

To deploy your very own Thorn instance, head over to [Vercel](https://vercel.com/new/) and select your fork, then fill in your enviroment variables.
(tip: you can paste in your .env directly)

**Note:** Change the value of `NEXT_AUTH_URL` to `[your Vercel URL]`, or else things will not work properly

To setup the Discord bot, take your Vercel URL and come over to the Discord Developers portal. In the "Interaction Webhook URL" section, enter the following: `<your Vercel URL>/api/bot`, and boom!

## Tech Stack

Thorn runs solely on Next.js with the [T3 stack](https://init.tips/), bootstrapped with [Create T3 App](https://create.t3.app/).

Here are some highlights:

- tRPC
- NextAuth.js
- Prisma
- Mantine

## License

Thorn uses the [MPL-2.0](https://choosealicense.com/licenses/mpl-2.0/) license.

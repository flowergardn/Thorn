# Thorn

A Minecraft moderation panel for server owners.

## First time setup

```bash
# Clone the project
git clone https://github.com/astridlol/Thorn
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

This registers the bot commands for your bot.

## Deployment

To deploy your very own Thorn instance, create a fork of it and head over to [Vercel](https://vercel.com/new/). Select your repository, then fill in your enviroment variables (tip: you can paste in your .env directly), and you're good to go!

To setup the Discord bot, take your Vercel URL and come over to the Discord Developers portal. In the "Interaction Webhook URL" section, enter the following: `<your Vercel URL>/api/bot`, and boom!

## Tech Stack

Thorn runs solely on Next.js, with the [T3 stack](https://init.tips/), bootstrapped with [Create T3 App](https://create.t3.app/).

Here are some highlights:

- tRPC
- NextAuth.js
- Prisma
- Mantine

## License

Thorn uses the [MPL-2.0](https://choosealicense.com/licenses/mpl-2.0/) license.

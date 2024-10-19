# musicbot
A modern and simple Discord  bot designed to play local files in your server. While the bot has been thoroughly
tested, I cannot guarantee stability. However, in almost all cases, the bot should be stable and fully functional when
self-hosted.

### System Requirements
- Node.js Version 20.17.0
- MySQL Version 8
- ffmpeg
- libtool
- automake

If you are using macOS, you will be able to acquire these tools through [Homebrew](https://brew.sh). For Linux users,
please consult your operating systems package manage. Unfortunately I do not use Windows, so I cannot guide you on
installation for these system requirement. Please consult online resources to acquire these tools and for additional help.

### Setup

1. Access the [Discord Developer Portal](https://discord.com/developers/) and create a new application.
   1. Make sure to take note of your Application's ID and token.
   2. The "SERVER MEMBERS INTENT" is required for the bot to correctly function.
   3. You can invite your app to your server using the following link - make sure to replace `<APPLICATION-ID>` with your bots application ID: `https://discord.com/oauth2/authorize?client_id=<APPLICATION_ID>&permissions=39586771240208&integration_type=0&scope=bot+applications.commands`
   4. While not required, feel free to fill out your bots description, tags, and give it a nice profile picture and banner while you're still in the developer portal!
2. Create a new database and use the database schema script located in the [scripts directory](https://github.com/arjan07/musicbot/blob/main/scripts/database-schema.sql) to create all the required tables.
3. Using the [example .env file](https://github.com/arjan07/musicbot/blob/main/scripts/example.env) located in the scripts directory, copy and paste them into your environments file (e.g. `.zprofile` on macOS) and set all the variables. `MUSIC_BOT_DB_CA` is not required, but can be used to encrypt data being sent to your MySQL server.
4. Using the [example music-server.json file](https://github.com/arjan07/musicbot/blob/main/scripts/example.music-servers.json) located in the scripts directory, copy and paste this into the music bot's root directory and rename it to `music-servers.json`
   1. This bot is designed to work multiple servers. However, the bot cannot be in multiple voice channels **IN THE SAME SERVER** at the same time.
   2. Make sure the `rootFilepath` ends with a slash (`/`) otherwise the bot will not find music. The `rootFilepath` is meant to be the directory where all your individual music files or folders will be stored.
   3. The rest of the filepath will be specified in the `Song` table in the MySQL database. For example `rootFilepath` = `/Volumes/Music/` and in the `Song` table set the `Path` column to `Artist/Awesome Song.mp3` 
5. Run `npm install` to automatically install are the required node modules. This could take around ~10 minutes to complete.
6. Run `npm build` to compile the source code into JavaScript. You should now have a `dist` directory.
7. Run `npm start` to start the bot. All going well, the bot should now be online and playing music!

### Slash Command Deployment
The Slash Command Deployment system is designed to work two ways. You can deploy commands locally using the `local.js`
script located in `slash-commands/build`, and you can deploy commands automatically when pushing to your GitHub repository.
Consult the `README.md` file in the `slash-commands/build` directory for more information.

#### Local Deployment
1. Make sure you have completed up to step 3 in the main setup guide.
2. Run `npm install` in the `slash-command/build` directory.
3. Run `npm local` to deploy slash commands. Please note that it can take up to an hour for slash commands to roll out to all your servers.

#### GitHub Deployment
1. Set up the following [secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) `CLIENTID` and `TOKEN`
2. Merge, or push, to the main branch on your GitHub repository.
3. The action should automatically start.

### Common Issues
- **Q:** "My bot is not joining my voice channel."
- **A:** Make sure your bot has the correct permissions to join the voice channel, also double check that your `voiceChannelId`, `stageChannelId`, and `guildId` are correct in your config file.


- **Q:** "My bot joined the voice channel but is not playing anything."
- **A:** Make sure your `primaryArtist` has music available in the `Song` table that is set to autoplay, as this will be the music that is played automatically.


- **Q:** "My question is not answered here."
- **A:** Open an [issue](https://github.com/arjan07/musicbot/issues), and i'll try get back to you as soon as possible!

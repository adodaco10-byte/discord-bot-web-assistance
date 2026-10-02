# Discord Bot + Web Assistant

A complete Python project that includes:

- Discord bot with commands and slash commands
- Web dashboard to chat with the assistant
- Optional integration with a real AI API
- Simple bot status and dashboard monitoring
- Docker support for easy deployment

## Features

- `!help`, `!ping`, `!status`, `!say`, `!ask` commands
- Discord slash commands for `/ping` and `/ask`
- Web assistant API to handle text prompts
- Web UI to send message to the assistant and to Discord
- Environment-based configuration via `.env`

## Quick start

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Add your Discord bot token and optional channel ID in `.env`.

5. Run the project:
   ```bash
   python main.py
   ```

6. Open the web dashboard:
   ```text
   http://localhost:5000
   ```

## Environment variables

- `DISCORD_TOKEN`: Your Discord bot token
- `BOT_NAME`: Name displayed by the bot
- `COMMAND_PREFIX`: Prefix to use for bot commands, default is `!`
- `WEB_HOST`: Host to bind the web app, default `0.0.0.0`
- `WEB_PORT`: Web port, default `5000`
- `WEB_ASSISTANT_ENABLED`: Set to `true`
- `DISCORD_CHANNEL_ID`: Optional Discord channel to send status messages
- `OPENAI_API_KEY`: Optional API key for AI-powered responses

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Notes

This project includes a working local assistant that responds to common prompts and can be upgraded with a real AI or database backend.

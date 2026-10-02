from flask import Flask, jsonify, request, render_template
from app.assistant import generate_response
from app.config import settings


def create_app(bot=None):
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["BOT"] = bot

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/api/health")
    def health():
        bot_status = "offline"
        if bot and bot.is_ready():
            bot_status = "online"

        return jsonify({
            "status": "ok",
            "bot": bot_status,
            "web": "online",
            "name": settings.BOT_NAME,
        })

    @app.route("/api/assistant", methods=["POST"])
    def assistant():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "").strip()

        if not message:
            return jsonify({"error": "No message provided."}), 400

        response = generate_response(message)
        return jsonify({"response": response})

    @app.route("/api/discord/send", methods=["POST"])
    def discord_send():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "").strip()
        channel_id = data.get("channel_id") or settings.DISCORD_CHANNEL_ID

        if not message:
            return jsonify({"error": "No message provided."}), 400

        if not bot or not bot.is_ready():
            return jsonify({"error": "Discord bot is not connected."}), 503

        if not channel_id:
            return jsonify({"error": "No Discord channel configured."}), 400

        try:
            channel = bot.get_channel(int(channel_id))
            if not channel:
                return jsonify({"error": "Channel not found."}), 404

            asyncio = __import__("asyncio")
            future = asyncio.run_coroutine_threadsafe(channel.send(message), bot.loop)
            future.result(timeout=10)
            return jsonify({"status": "sent", "channel_id": channel_id})
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

    return app

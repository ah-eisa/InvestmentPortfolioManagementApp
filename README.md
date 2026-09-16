# Capital AI Trader Mobile

Personal Android trading runner for Capital.com with OpenAI/Grok/DeepSeek filtering.

- Source snapshot: `source.zip`
- Android build is produced automatically by GitHub Actions.
- Generated APK is published to `site/Capital-AI-Trader-v0.1.0.apk`.
- Capital.com and AI credentials are never committed. They are entered in the Android app and encrypted locally with Android Keystore.
- Default execution mode is `SHADOW`.
- `LIVE` requires the exact local phrase `I_UNDERSTAND_REAL_MONEY`.

The `capital-trader-mobile` branch is isolated from the existing `main` application.

# Daft Chat

This Expo project provides a simple cross-platform chatroom using the Stream Chat API.

## Getting Started

1. Install [Node.js](https://nodejs.org/) and the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).
2. Run `npm install` to install dependencies.
3. Start the development server with one of the scripts in `package.json`:
   - `npm run ios` – launch the iOS simulator or Expo Go.
   - `npm run android` – launch Android emulator or device.
   - `npm run web` – open the chat in a web browser.

The app connects to a token server at `http://159.198.74.139:3000/token` and joins the **daft-channel** on Stream Chat. All three platforms share the same chatroom.

## Project Structure

- `App.js` – main logic for connecting to Stream Chat and rendering the chat interface.
- `index.js` – entry point for Expo.
- `app.json` – Expo configuration.

Feel free to customize the token server URL or Stream Chat API key in `App.js` if needed.

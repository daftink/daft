#!/usr/bin/env bash
#
# One-shot setup for Daft Chatroom on Ubuntu + Nginx + Node18
#
# 1) Install Node18, Nginx & Git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs nginx git

# 2) Scaffold a temp CRA
cd /tmp
npx create-react-app daft-chat-temp
cd daft-chat-temp

# 3) Install Stream Chat SDKs + standalone CSS
npm install stream-chat stream-chat-react stream-chat-css

# 4) Overwrite src/App.js with minimal chat UI
cat > src/App.js << 'APPJS'
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import 'stream-chat-css/dist/css/index.css';

const API_KEY = '3nkn6wg7k7zt';

function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'daftuser' }),
      });
      if (!res.ok) throw new Error('Token fetch failed ' + res.status);
      const { token } = await res.json();
      const chatClient = StreamChat.getInstance(API_KEY);
      await chatClient.connectUser(
        { id: 'daftuser', name: 'Daft User' },
        token
      );
      setClient(chatClient);
    })();
  }, []);

  if (!client) return <div>Loading chat…</div>;

  const channel = client.channel('messaging', 'daft-channel', { name: 'Daft Chat' });

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
}

export default App;
APPJS

# 5) Build and deploy
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
sudo touch /var/www/html/favicon.ico
sudo chown -R www-data:www-data /var/www/html

# 6) Reload Nginx
sudo nginx -t && systemctl reload nginx

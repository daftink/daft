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

const API_KEY  = '3nkn6wg7k7zt';
const USER_ID  = 'daftuser';

export default function App() {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);

  useEffect(() => {
    (async () => {
      // 1) bootstrap the client
      const chatClient = StreamChat.getInstance(API_KEY);
      const res = await fetch('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID }),
      });
      if (!res.ok) throw new Error('token fetch failed: ' + res.status);
      const { token } = await res.json();
      await chatClient.connectUser({ id: USER_ID, name: 'Daft User' }, token);

      // 2) create & watch our channel
      const channel = chatClient.channel('messaging', 'daft-channel', {
        name: 'Daft Chat',
      });
      await channel.watch();

      // 3) hand off to React
      setClient(chatClient);
      setActiveChannel(channel);
    })();

    return () => client?.disconnectUser();
  }, []);

  if (!client || !activeChannel) {
    return <div style={{ padding: 20 }}>Loading chat…</div>;
  }

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={activeChannel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
}

import React, { useEffect, useState } from 'react';
import { SafeAreaView, useColorScheme, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  OverlayProvider,
  Channel,
  MessageList,
  MessageInput,
} from 'stream-chat-expo';

const API_KEY = '3nkn6wg7k7zt';
const user = {
  id: 'daftuser',
  name: 'Daft User',
};

const client = StreamChat.getInstance(API_KEY);

const getUserToken = async () => {
  const response = await fetch('http://159.198.74.139:3000/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id }),
  });
  const data = await response.json();
  return data.token;
};

export default function App() {
  const [channel, setChannel] = useState(null);
  const scheme = useColorScheme();

  useEffect(() => {
    async function initChat() {
      try {
        console.log('🌐 Fetching token...');
        const token = await getUserToken();
        console.log('🔑 Token received, connecting user...');

        await client.connectUser(user, token);
        console.log('✅ Connected to Stream!');

        const channel = client.channel('messaging', 'daft-channel', {
          name: 'Daft Chatroom',
          members: [user.id],
        });

        await channel.watch();
        console.log('📡 Channel is ready!');
        setChannel(channel);
      } catch (err) {
        console.error('❌ Chat connection failed:', err);
      }
    }

    initChat();
    return () => client.disconnectUser();
  }, []);

  if (!channel) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: scheme === 'dark' ? '#000' : '#fff',
        }}>
          <ActivityIndicator size="large" color="#888" />
          <Text style={{ marginTop: 10, color: scheme === 'dark' ? '#fff' : '#000' }}>
            Loading chat...
          </Text>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <Chat client={client} theme={scheme === 'dark' ? 'dark' : 'light'}>
          <Channel channel={channel}>
            <SafeAreaView style={{ flex: 1 }}>
              <MessageList />
              <MessageInput />
            </SafeAreaView>
          </Channel>
        </Chat>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}

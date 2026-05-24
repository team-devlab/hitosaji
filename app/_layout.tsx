import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Welcome' }} />
            <Stack.Screen name="hello-world" options={{ title: 'Hello World' }} />
            <Stack.Screen name="album" options={{ title: 'アルバム' }} />
            <Stack.Screen name="new-bookmark" options={{ title: 'しおりを残す' }} />
        </Stack>
    );
}
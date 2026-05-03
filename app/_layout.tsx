import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Wellcome' }} />
            <Stack.Screen name="hello-world" options={{ title: 'Hello World' }} />
        </Stack>
    );
}
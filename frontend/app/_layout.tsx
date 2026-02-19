import '@/global.css';
import { AppProvider } from '@/context/AppContext';
import { Toast } from '@/components/ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" backgroundColor="#FAFAFA" />
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

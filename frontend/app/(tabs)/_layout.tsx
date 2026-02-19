import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Platform } from 'react-native';

type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
  color: string;
};

function TabIcon({ emoji, label, focused, color }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? '700' : '400',
          color: focused ? color : '#9CA3AF',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Ana Sayfa" focused={focused} color="#EC4899" />
          ),
        }}
      />
      <Tabs.Screen
        name="feeding"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🍼" label="Beslenme" focused={focused} color="#8B5CF6" />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💛" label="Duygular" focused={focused} color="#F59E0B" />
          ),
        }}
      />
      <Tabs.Screen
        name="panas"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="PANAS" focused={focused} color="#10B981" />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📝" label="Notlar" focused={focused} color="#6366F1" />
          ),
        }}
      />
    </Tabs>
  );
}

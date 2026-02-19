import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  accent?: string;
}

export function Card({ children, style, title, accent }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
          borderLeftWidth: accent ? 4 : 0,
          borderLeftColor: accent ?? 'transparent',
        },
        style,
      ]}
    >
      {title && (
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

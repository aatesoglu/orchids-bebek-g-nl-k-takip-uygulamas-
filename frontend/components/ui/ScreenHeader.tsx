import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  color?: string;
}

export function ScreenHeader({ title, subtitle, rightAction, color = '#EC4899' }: ScreenHeaderProps) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1F2937' }}>{title}</Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {rightAction && (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${color}20`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{rightAction.icon}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

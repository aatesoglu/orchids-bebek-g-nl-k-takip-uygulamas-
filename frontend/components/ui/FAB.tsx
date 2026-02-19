import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FABProps {
  onPress: () => void;
  color?: string;
}

export function FAB({ onPress, color = '#EC4899' }: FABProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 24,
          right: 20,
          zIndex: 100,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 28, lineHeight: 30, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

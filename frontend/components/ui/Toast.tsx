import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useApp } from '@/context/AppContext';

const COLORS = {
  success: { bg: '#10B981', text: '#FFFFFF', icon: '✓' },
  error: { bg: '#EF4444', text: '#FFFFFF', icon: '✕' },
  info: { bg: '#6366F1', text: '#FFFFFF', icon: 'ℹ' },
};

export function Toast() {
  const { state, hideToast } = useApp();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state.toastMessage) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state.toastMessage]);

  if (!state.toastMessage) return null;

  const config = COLORS[state.toastType];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 56,
        left: 20,
        right: 20,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        style={{
          backgroundColor: config.bg,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ color: config.text, fontWeight: '700', fontSize: 14 }}>
            {config.icon}
          </Text>
        </View>
        <Text style={{ color: config.text, fontSize: 14, fontWeight: '600', flex: 1 }}>
          {state.toastMessage}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

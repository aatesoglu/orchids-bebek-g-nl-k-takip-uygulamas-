import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const COLORS: Record<string, { bg: string; text: string; border?: string }> = {
  primary: { bg: '#EC4899', text: '#FFFFFF' },
  secondary: { bg: '#6366F1', text: '#FFFFFF' },
  danger: { bg: '#EF4444', text: '#FFFFFF' },
  outline: { bg: 'transparent', text: '#EC4899', border: '#EC4899' },
  ghost: { bg: 'transparent', text: '#6B7280' },
};

const SIZES = {
  sm: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 13, borderRadius: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, borderRadius: 12 },
  lg: { paddingHorizontal: 24, paddingVertical: 14, fontSize: 16, borderRadius: 14 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const colors = COLORS[variant];
  const sizeConfig = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: colors.bg,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: sizeConfig.borderRadius,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={colors.text}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        style={[
          {
            color: colors.text,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

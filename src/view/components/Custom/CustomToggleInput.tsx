import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalize } from '~/utils/getWindowHeight';
import { colors } from '~/view/theme';

interface Props {
  value: boolean;
  onValueChange: () => void;
  activeColor?: string;
  inactiveColor?: string;
  containerStyle?: object;
  disabled?: boolean;
}

export const CustomToggleInput: React.FC<Props> = ({
  value,
  onValueChange,
  activeColor = "#34C759",
  inactiveColor = colors.primary,
  containerStyle = {},
  disabled,
}) => {

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.toggle,
          value ? { backgroundColor: activeColor } : { backgroundColor: inactiveColor },
        ]}
        disabled={disabled}
        onPress={onValueChange}
      >
        <View style={[styles.toggleText, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  toggle: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 2,
    width: normalize(38)
  },
  toggleText: {
    borderRadius: 100,
    height: normalize(16),
    width: normalize(16),
    backgroundColor: '#fff'
  },
});

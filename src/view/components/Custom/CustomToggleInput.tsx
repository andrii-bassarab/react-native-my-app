import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '~/view/theme';

interface Props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  containerStyle?: object;
}

export const CustomToggleInput: React.FC<Props> = ({
  value,
  onValueChange,
  activeColor = "#34C759",
  inactiveColor = colors.primary,
  containerStyle = {},
}) => {
  const toggleValue = () => {
    onValueChange(!value);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.toggle,
          value ? { backgroundColor: activeColor } : { backgroundColor: inactiveColor },
        ]}
        onPress={toggleValue}
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
    width: 32
  },
  toggleText: {
    borderRadius: 100,
    height: 14,
    width: 14,
    backgroundColor: '#fff'
  },
});

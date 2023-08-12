import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../theme';
import { normalize } from '~/utils/normalize/normalize';

interface Props {
  label?: string; 
  checked: boolean;
  onChange: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomCheckbox: React.FC<Props> = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity onPress={() => onChange((prev) => !prev)} style={styles.container}>
      <View style={{...styles.checkbox, borderColor: checked ? colors.blue : colors.primary, backgroundColor: checked ? colors.blue : '#fff' }}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    position: 'relative',
    width: normalize(32),
    height: normalize(32),
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '5%',
    borderRadius: 3
  },
  checkmark: {
    position: 'absolute',
    fontWeight: '700',
    color: '#fff',
    ...textStyles.regular,
  },
  label: {
    ...textStyles.regular,
    color: colors.primary,
    fontWeight: '500'
  },
});

export default CustomCheckbox;
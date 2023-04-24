import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '~/view/theme';

export const Toast = ({ message }: any) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          hideToast();
        }, 3000);
      });
    }
  }, [isVisible]);

  const showToast = () => {
    setIsVisible(true);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      {isVisible && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim, paddingTop: insets.top }]}>
          <Text style={styles.text}>{"message"}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    width: "100%"
  },
  toast: {
    backgroundColor: colors.green,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: 'center'
  },
  text: {
    color: '#fff',
  },
});

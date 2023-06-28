import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Pressable,
  Animated,
  PanResponder,
  Modal,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  children?: React.ReactNode;
  closeModalFunction: () => void;
  height: string | number;
  percentSwipeToClose: number;
}

export const ModalSwipeScreen: React.FC<Props> = ({ closeModalFunction, children, height, percentSwipeToClose }) => {
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();

  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = pan.y.interpolate({
    inputRange: [50, windowHeight * percentSwipeToClose],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > windowHeight * percentSwipeToClose) {
          pan.extractOffset();
          closeModalFunction();
        }
        if (gestureState.dy > 0) {
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.y.setValue(0);
  }, []);

  return (
    <Modal transparent={true}>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeModalFunction();
        }}
      >
        <Animated.View
          style={[
            styles.content,
            styles.shadowProp,
            { transform: [{ translateY: pan.y }], height, paddingBottom: insets.bottom, opacity },
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(event) => {
            event.stopPropagation();
          }}
        >
          <Animated.View {...panResponder.panHandlers}>
            <TouchableOpacity style={styles.labelBox} activeOpacity={0.5}>
              <View style={styles.closeLabel} />
            </TouchableOpacity>
          </Animated.View>
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  content: {
    backgroundColor: "#fff",
    opacity: 1,
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  closeLabel: {
    height: normalize(8),
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  labelBox: {
    paddingVertical: normalize(20),
    flex: 1,
  },
});

import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { colors, textStyles } from "../../theme";
import { setSelectedSite } from "~/modules/user/actions";
import { actionsShowWindow } from "~/modules/showWindow";
import { normalize } from "~/utils/normalize/normalize";
import { CustomSelect, OptionItem } from "../Custom/CustomSelect";

export const CustomerSite = () => {
  const windowHeight = Dimensions.get("window").height;
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [chosenSite, setChosenSite] = useState({
    name: currentUser.selectedSite.customerId,
    value: currentUser.selectedSite.customerId,
  });

  const closeSwitchSite = () => dispatch(actionsShowWindow.setShowSwitchSite(false));

  const position = useMemo(() => new Animated.ValueXY({ x: 0, y: windowHeight * 0.15 }), []);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    pan.y.setValue(0);

    return Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (!currentUser.selectedSite && currentUser.availableSites.length > 1) {
          return;
        }
        if (gestureState.dy > windowHeight * 0.15) {
          pan.extractOffset();
          closeSwitchSite();
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

  return (
    <Modal transparent>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeSwitchSite();
        }}
        disabled={!currentUser.selectedSite && currentUser.availableSites.length > 1}
      >
        <Animated.View
          style={[
            { ...styles.switchBox, transform: [{ translateY: pan.y }] },
            position.getLayout(),
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(event) => {
            event.stopPropagation();
          }}
        >
          <Animated.View style={styles.switchSiteLabelBox} {...panResponder.panHandlers}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                paddingVertical: "5%",
              }}
            >
              <View style={styles.switchSiteLabel} />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.switchSiteTitle}>Choose Your Customer Site</Text>
          <CustomSelect
            data={currentUser.availableSites.map((site) => ({
              name: site.name,
              value: site.code,
            }))}
            selectedItem={chosenSite}
            setSelectedItem={setChosenSite as Dispatch<SetStateAction<OptionItem>>}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              // dispatch(
              //   setSelectedSite({
              //     sideId: chosenSite.value,
              //     customerId: chosenSite.value,
              //   })
              // );
              closeSwitchSite();
            }}
          >
            <Text style={styles.saveButtonText}>Apply</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    opacity: 1,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  dropdownContainer: {
    marginTop: "5%",
    borderColor: colors.primary,
    borderTopWidth: 0,
    zIndex: 2,
    borderTopRightRadius: normalize(34),
    borderTopLeftRadius: normalize(34),
    borderBottomLeftRadius: Platform.OS === "ios" ? normalize(20) : 0,
    borderBottomRightRadius: Platform.OS === "ios" ? normalize(20) : 0,
  },
  selectedLabel: {
    borderRadius: normalize(50),
    borderWidth: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 3,
    backgroundColor: "#fff",
  },
  selectedText: {
    ...textStyles.regular,
    color: colors.primary,
    fontWeight: "500",
  },
  dropdownOptionsContainer: {
    paddingVertical: 10,
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
    maxHeight: normalize(190),
  },
  dropdownOptionsLabel: {
    padding: normalize(10),
    paddingHorizontal: normalize(25),
    borderColor: colors.layout,
  },
  saveButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 55,
    paddingVertical: 10,
    backgroundColor: colors.layout,
    borderRadius: 50,
    marginTop: "5%",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    ...textStyles.small,
  },
  switchSiteLabel: {
    height: normalize(6),
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  switchSiteLabelBox: {
    marginTop: "3%",
    height: normalize(25),
    justifyContent: "center",
  },
  switchBox: {
    height: "40%",
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 0,
    alignItems: "stretch",
    paddingHorizontal: "12%",
  },
  switchSiteTitle: {
    alignSelf: "flex-start",
    marginTop: 10,
    ...textStyles.medium,
    fontWeight: "600",
    color: "#808080",
  },
});

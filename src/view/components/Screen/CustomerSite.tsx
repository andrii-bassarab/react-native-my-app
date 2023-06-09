import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Pressable,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { colors, textStyles } from "../../theme";
import SelectIcon from "~/view/assets/icons/selectArrow.svg";
import { setSelectedSite } from "~/modules/user/actions";
import { actionsShowWindow } from "~/modules/showWindow";
import { normalize } from "~/utils/getWindowHeight";

export const CustomerSite = () => {
  const windowHeight = Dimensions.get("window").height;
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [chosenSite, setChosenSite] = useState(
    currentUser.selectedSite || currentUser.availableSites[0]
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const closeSwitchSite = () =>
    dispatch(actionsShowWindow.setShowSwitchSite(false));

  const position = useMemo(
    () => new Animated.ValueXY({ x: 0, y: windowHeight * 0.15 }),
    []
  );
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
        if (
          !currentUser.selectedSite &&
          currentUser.availableSites.length > 1
        ) {
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
        disabled={
          !currentUser.selectedSite && currentUser.availableSites.length > 1
        }
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
          <Animated.View
            style={styles.switchSiteLabelBox}
            {...panResponder.panHandlers}
          >
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
          <View
            style={{
              ...styles.dropdownContainer,
              borderWidth: showDropdown ? 1 : 0,
            }}
          >
            <TouchableOpacity
              style={styles.selectedLabel}
              onPress={() => setShowDropdown((prev) => !prev)}
            >
              <Text style={styles.selectedText}>{chosenSite.name}</Text>
              <SelectIcon height={10} width={20} color={colors.primary} />
            </TouchableOpacity>
            {showDropdown && (
              <ScrollView style={styles.dropdownOptionsContainer}>
                {currentUser.availableSites.map((site) => (
                  <TouchableOpacity
                    key={site.code}
                    style={{
                      ...styles.dropdownOptionsLabel,
                      backgroundColor:
                        chosenSite.name === site.name ? colors.blue : "#fff",
                      borderTopWidth: chosenSite.name === site.name ? 0.5 : 0,
                      borderBottomWidth:
                        chosenSite.name === site.name ? 0.5 : 0,
                    }}
                    onPress={() => {
                      setChosenSite(site);
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={{
                        color:
                          chosenSite.name === site.name
                            ? "#fff"
                            : colors.primary,
                        ...textStyles.regular,
                      }}
                    >
                      {site.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={{ height: 15 }}></View>
              </ScrollView>
            )}
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              dispatch(setSelectedSite(chosenSite));
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
    borderTopRightRadius: normalize(33),
    borderTopLeftRadius: normalize(33),
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
    backgroundColor: '#fff'
  },
  selectedText: {
    ...textStyles.regular,
    color: colors.primary,
    fontWeight: "500",
  },
  dropdownOptionsContainer: {
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: normalize(150),
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

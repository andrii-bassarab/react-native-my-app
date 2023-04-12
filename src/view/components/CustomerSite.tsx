import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Pressable,
} from "react-native";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { colors } from "../theme";
import SelectIcon from "../assets/icons/selectArrow.svg";
import { setShowSwitchSite } from "~/modules/user/actions";

const mocksSites = [
  { name: "Kanso Industries", code: "Kanso Industries" },
  { name: "Site 3", code: "Site 3" },
  { name: "Site 2", code: "Site 2" },
  { name: "Site 4", code: "Site 4" },
  { name: "Site 5", code: "Site 5" },
  { name: "Site 6", code: "Site 6" },
];

export const CustomerSite = () => {
  const [selectedSite, setSelectedSite] = useState("Kanso Industries");
  const [showDropdown, setShowDropdown] = useState(false);

  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const closeSwitchSite = () => dispatch(setShowSwitchSite(false));

  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    pan.y.setValue(0);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 120) {
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
    <View style={styles.screen}>
      <Pressable style={{ flex: 1 }} onPress={closeSwitchSite}></Pressable>
      <Animated.View
        style={{ ...styles.switchBox, transform: [{ translateY: pan.y }] }}
      >
        <Animated.View
          style={styles.switchSiteLabelBox}
          {...panResponder.panHandlers}
        >
          <View style={styles.switchSiteLabel} />
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
            <Text style={styles.selectedText}>{selectedSite}</Text>
            <SelectIcon height={10} width={20} color={colors.primary} />
          </TouchableOpacity>
          {showDropdown && (
            <ScrollView style={styles.dropdownOptionsContainer}>
              {mocksSites.map((site) => (
                <TouchableOpacity
                  key={site.code}
                  style={{
                    ...styles.dropdownOptionsLabel,
                    backgroundColor: selectedSite === site.name ? colors.blue : "#fff",
                    borderTopWidth: selectedSite === site.name ? 0.5 : 0,
                    borderBottomWidth: selectedSite === site.name ? 0.5 : 0,
                  }}
                  onPress={() => {
                    setSelectedSite(site.name);
                    setShowDropdown(false);
                  }}
                >
                  <Text
                    style={{
                      color: selectedSite === site.name ? "#fff" : colors.primary,
                      fontSize: 16,
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
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Apply</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
  },
  dropdownContainer: {
    marginTop: 20,
    borderRadius: 20,
    borderColor: colors.primary,
    borderTopWidth: 0,
    zIndex: 2,
  },
  selectedLabel: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  dropdownOptionsContainer: {
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: 130,
  },
  dropdownOptionsLabel: {
    padding: 5,
    paddingHorizontal: 20,
    borderColor: colors.layout,
  },
  saveButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 55,
    paddingVertical: 10,
    backgroundColor: colors.layout,
    borderRadius: 50,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  switchSiteLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  switchSiteLabelBox: {
    paddingVertical: 10,
  },
  switchBox: {
    height: "55%",
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 10,
    alignItems: "stretch",
  },
  switchSiteTitle: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#808080",
  },
});

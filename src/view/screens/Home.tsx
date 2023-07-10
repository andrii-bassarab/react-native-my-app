import "react-native-gesture-handler";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen/Screen";
import { colors, layout, textStyles } from "../theme";
import { InspectionCard } from "../components/Inspections/InspectionCard";
import { ContentLoader } from "../components/Loader/Loader";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { inspections, visibleLoader } = useAppSelector(
    (state) => state.inspections
  );

  console.log("inspections", inspections.map(item => ({
    name: item.visibleLandlordName,
    id: item.unit.streetAddress,
  })))

  return (
    <Screen
      backgroundColor={colors.layout}
      paddingTop={layout.screenPadding}
      borderRadius={normalize(100)}
    >
      <View style={styles.content}>
        <WelcomeBox
          backgroundColor="transparant"
          textColor={colors.darkGrey}
          showText
        />
        <View style={styles.activityBox}>
          <View>
            {visibleLoader && inspections.length === 0 ? (
              <View style={styles.contentLoaderContainer}>
                <ContentLoader />
              </View>
            ) : (
              <FlatList
                data={inspections}
                keyExtractor={(item, index) => `key-${item.id}`}
                renderItem={({ item }) => (
                  <InspectionCard
                    onPress={() =>
                      navigation.navigate("InspectionNavigation", {
                        screen: "InspectionItem",
                        params: item,
                      })
                    }
                    inspection={item}
                  />
                )}
                ListHeaderComponent={() => (
                  <Text style={[styles.activityTitle, textStyles.medium]}>
                    Recent Activity
                  </Text>
                )}
                ListFooterComponent={() => (
                  <View style={{ height: normalize(180) }} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    padding: 25,
    paddingHorizontal: "7%",
  },
  activityBox: {
    marginTop: "2%",
  },
  activityTitle: {
    color: "#7F888D",
    fontWeight: "700",
    marginBottom: 10,
    ...textStyles.large,
  },
  contentLoaderContainer: {
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

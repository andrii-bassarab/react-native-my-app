import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { colors } from "../theme";
import { WelcomeBox } from "../components/WelcomeBox";
import { SearchForm } from "../components/SearchForm";
import { mocksData } from "../screens/Home";
import { ActivityItem } from "../components/ActivityItem";
import { ModalLoader } from "../components/ModalLoader";

export const Inspections = () => {
  const [query, setQuery] = useState("");
  const [visibleInspections, setVisibleInspections] = useState(mocksData);

  const makeRequest = () => {
    console.log("Making request...", query);
    setVisibleInspections(
      mocksData.filter((item) =>
        item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      makeRequest();
    }, 700);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screenContainer}>
        <View style={styles.content}>
          <WelcomeBox
            backgroundColor="transparant"
            textColor={colors.primary}
          />
          <Text style={styles.title}>Inspections</Text>
          <SearchForm query={query} setQuery={setQuery} />
          <View style={{ marginBottom: "45%", marginTop: 10 }}>
            <FlatList
              data={visibleInspections}
              keyExtractor={(item, index) => `key-${index}`}
              renderItem={({ item }) => <ActivityItem item={item} />}
              ListFooterComponent={() => <View style={{ height: 20 }} />}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
      {/* <ModalLoader /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C4660",
  },
  screenContainer: {
    paddingTop: 15,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
    paddingTop: 15,
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
    marginTop: "5%",
    marginBottom: "3%",
  },
});

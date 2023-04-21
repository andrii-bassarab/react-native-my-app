import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getColorCategoryByResult } from "~/utils/getInspectionColor";
import { colors } from "~/view/theme";
import CompletedIcon from "~/view/assets/icons/completed.svg";
import FailedIcon from "~/view/assets/icons/failed.svg";

interface Props {
  category: {
    title: string;
    status: string;
    result: string;
    items: number;
    photos: string;
  };
}

export const InspectionCategory: React.FC<Props> = ({ category }) => {
  const { title, status, result, items, photos } = category;

  const itemColor = getColorCategoryByResult(result, status);

  return (
    <View style={[styles.card, styles.shadowProp, { borderColor: itemColor }]}>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <Text style={{ ...styles.cardTitle, color: itemColor }}>{title}</Text>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Status:</Text>
              <Text style={styles.text}>{status}</Text>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>Result:</Text>
              <Text style={styles.text}>{result}</Text>
            </View>
          </View>
          <View style={{ flex: 0.6 }}>
            <View style={styles.label}>
              <Text style={{ ...styles.labelText, flex: 1.4 }}>Items:</Text>
              <Text style={styles.text}>{items}</Text>
            </View>
            <View style={styles.label}>
              <Text style={{ ...styles.labelText, flex: 1.4 }}>Photos:</Text>
              <Text style={styles.text}>{photos}</Text>
            </View>
          </View>
          {status === "Complete" && result === "Passed" && (
            <View style={{ flex: 0.2, alignItems: "center" }}>
              <CompletedIcon color={"#96BF5B"} height={30} width={30} />
            </View>
          )}
          {status === "Complete" && result === "Failed" && (
            <View style={styles.failedBox}>
              <FailedIcon color={"#fff"} height={15} width={15} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "98%",
    flexWrap: "wrap",
    height: 100,
    borderWidth: 2,
    marginBottom: 10
  },
  content: {
    flexDirection: "row",
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  mainInfo: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: 10,
    alignSelf: "stretch",
    width: "100%",
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    fontSize: 13,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    textAlign: "left",
    flex: 1,
    fontSize: 13,
  },
  failedBox: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.red,
    borderRadius: 100,
  },
});

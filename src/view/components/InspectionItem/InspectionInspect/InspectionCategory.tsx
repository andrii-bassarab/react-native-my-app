import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { getColorCategoryByResult } from "~/utils/getInspectionColor";
import { colors } from "~/view/theme";
import CompletedIcon from "~/view/assets/icons/completed.svg";
import FailedIcon from "~/view/assets/icons/failed.svg";
import DotsIcon from "~/view/assets/icons/dots.svg";
import DeleteIcon from "~/view/assets/icons/delete.svg";
import DeleteModalIcon from "~/view/assets/icons/deleteModal.svg";
import { ModalDeleteItem } from "../../Custom/ModalDeleteItem";
import { useAppSelector } from "~/store/hooks";
import { InspectionStatus } from "~/types/inspectionStatus";
import { useMutation } from "@apollo/client";
import { DELETE_CATEGORY } from "~/services/api/GetInspectionCategory";

interface Props {
  category: {
    id: string;
    title: string;
    status: string;
    result: string;
    items: number;
    photos: string;
    categoryAdded?: boolean;
  };
}

export const InspectionCategory: React.FC<Props> = ({ category }) => {
  const { title, status, result, items, photos, categoryAdded } = category;
  const [showDeleteLabel, setShowDeleteLabel] = useState(false);
  const [showDeleteModalWindow, setShowDeleteModalWindow] = useState(false);
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { profile } = useAppSelector((state) => state.user);

  const itemColor = getColorCategoryByResult(result, status);

  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY);

  const closeModalDeleteWindow = () => {
    setShowDeleteModalWindow(false);
    setShowDeleteLabel(false);
  }

  const onContinue = async () => {
    await deleteCategory({
      variables: {
        command: {
          customerId: "pfdylv",
          siteId: "pfdylv",
          id: category.id,
          deletedBy: profile?.email || "",
        },
      },
    });

    closeModalDeleteWindow()
  };

  const handleClickOnDotsIcon = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setShowDeleteLabel((prev) => !prev);
  };

  return (
    <View style={[styles.card, styles.shadowProp, { borderColor: itemColor }]}>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <View style={styles.titleLabel}>
          <Text style={{ ...styles.cardTitle, color: itemColor, flex: 1.5 }}>
            {title}
          </Text>
          {categoryAdded &&
            status !== "Complete" &&
            inspectionItem?.status !== InspectionStatus.COMPLETE && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 0.2,
                }}
              >
                {showDeleteLabel && (
                  <TouchableOpacity
                    style={[styles.deleteLabel, styles.shadowProp]}
                    onPress={() => setShowDeleteModalWindow((prev) => !prev)}
                  >
                    <DeleteIcon color={colors.layout} width={20} height={15} />
                    <Text>Delete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleClickOnDotsIcon}
                  style={{ paddingHorizontal: "50%", paddingVertical: "10%" }}
                >
                  <DotsIcon color={colors.primary} height={15} width={15} />
                </TouchableOpacity>
              </View>
            )}
        </View>
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
          <View style={{ flex: 0.2, alignItems: "center" }}>
            {status === "Complete" && result === "Passed" && (
              <CompletedIcon color={"#96BF5B"} height={30} width={30} />
            )}
            {status === "Complete" && result === "Failed" && (
              <View style={styles.failedBox}>
                <FailedIcon color={"#fff"} height={15} width={15} />
              </View>
            )}
          </View>
        </View>
      </View>
      {showDeleteModalWindow && (
        <ModalDeleteItem
          title={"Are you sure you want to delete “Living Room (Additional)”?"}
          Icon={DeleteModalIcon}
          onContinue={onContinue}
          onCancel={closeModalDeleteWindow}
        />
      )}
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
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  titleLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteLabel: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    position: "absolute",
    right: "100%",
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { getColorCategoryByResult } from "~/utils/getInspectionColor";
import { colors, textStyles } from "~/view/theme";
import CompletedIcon from "~/view/assets/icons/completed.svg";
import FailedIcon from "~/view/assets/icons/failed.svg";
import DotsIcon from "~/view/assets/icons/dots.svg";
import DeleteIcon from "~/view/assets/icons/delete.svg";
import DeleteModalIcon from "~/view/assets/icons/deleteModal.svg";
import { ModalDeleteItem } from "../../Custom/ModalDeleteItem";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionStatus } from "~/types/inspectionStatus";
import { ApolloCache, useMutation } from "@apollo/client";
import {
  DELETE_CATEGORY,
  GET_ALL_INSPECTIONS_CATEGORY,
} from "~/services/api/GetInspectionCategory";
import { ModalLoader } from "../../Loader/ModalLoader";
import { actionsToastNotification } from "~/modules/toastNotification";
import { normalize } from "~/utils/getWindowHeight";

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
  const dispatch = useAppDispatch();
  const { title, status, result, items, photos, categoryAdded } = category;
  const [showDeleteLabel, setShowDeleteLabel] = useState(false);
  const [showDeleteModalWindow, setShowDeleteModalWindow] = useState(false);
  const { inspectionItem, categories } = useAppSelector(
    (state) => state.inspectionItem
  );
  const { profile } = useAppSelector((state) => state.user);

  const itemColor = getColorCategoryByResult(result, status);

  const [deleteCategory, { loading, data }] = useMutation(DELETE_CATEGORY);

  const closeModalDeleteWindow = () => {
    setShowDeleteModalWindow(false);
    setShowDeleteLabel(false);
  };

  // const updateStatusCache = () => {
  //   return (cache: ApolloCache<any>, { data }: any) => {
  //     if (!data?.deleteInspectionCategory?.affectedEntity?.id) {
  //       return;
  //     }

  //     const deletedItem = data?.deleteInspectionCategory;
  //     const { inspectionCategories } = cache.readQuery({
  //       query: GET_ALL_INSPECTIONS_CATEGORY,
  //       variables: {
  //         ids: [inspectionItem?.templateId],
  //       },
  //     }) as {
  //       inspectionCategories: any;
  //     };

  //     const itemIndex = inspectionCategories.edges.findIndex(
  //       (edge: any) => edge.node.id === deletedItem?.affectedEntity?.id
  //     );

  //     if (itemIndex !== -1) {
  //       // inspectionCategories.edges.splice(itemIndex, 1);

  //       inspectionCategories.edges = inspectionCategories.edges.filter(
  //         (edge: any) => edge.node.id !== deletedItem?.affectedEntity?.id
  //       );

  //       cache.writeQuery({
  //         query: GET_ALL_INSPECTIONS_CATEGORY,
  //         data: { inspectionCategories },
  //       });
  //     }
  //   };
  // };

  const onContinue = async () => {
    try {
      await deleteCategory({
        variables: {
          command: {
            customerId: "pfdylv",
            siteId: "pfdylv",
            id: category.id,
            deletedBy: profile?.email || "test",
          },
        },
        refetchQueries: [
          {
            query: GET_ALL_INSPECTIONS_CATEGORY,
            variables: {
              id: inspectionItem?.templateId,
            },
          },
        ],
        awaitRefetchQueries: true,
      });
      if (data?.affectedEntity) {
        dispatch(
          actionsToastNotification.showToastMessage(
            "Success! Category was deleted."
          )
        );
      }
    } finally {
      closeModalDeleteWindow();
    }
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
                    <DeleteIcon
                      color={colors.layout}
                      width={normalize(25)}
                      height={normalize(25)}
                    />
                    <Text style={{ marginLeft: normalize(5) }}>Delete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleClickOnDotsIcon}
                  style={{ paddingHorizontal: "30%", paddingVertical: "10%" }}
                >
                  <DotsIcon
                    color={colors.primary}
                    height={normalize(25)}
                    width={normalize(25)}
                  />
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
              <CompletedIcon
                color={"#96BF5B"}
                height={normalize(40)}
                width={normalize(40)}
              />
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
          loading={loading}
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
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    width: "98%",
    flexWrap: "wrap",
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
    fontWeight: "500",
    ...textStyles.regular,
  },
  mainInfo: {
    flex: 1,
    borderLeftWidth: normalize(4),
    paddingLeft: normalize(15),
    alignSelf: "stretch",
    width: "100%",
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    ...textStyles.little,
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
    ...textStyles.little,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
    position: "absolute",
    right: "100%",
  },
});

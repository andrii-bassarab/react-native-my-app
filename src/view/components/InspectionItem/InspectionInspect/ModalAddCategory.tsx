import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { colors, textStyles } from "~/view/theme";
import { CustomSelect, OptionItem } from "../../Custom/CustomSelect";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useMutation } from "@apollo/client";
import {
  ADD_INSPECTION_CATEGORY,
  GET_ALL_INSPECTIONS_CATEGORY,
} from "~/services/api/GetInspectionCategory";
import { ModalLoader } from "../../Loader/ModalLoader";
import { actionsToastNotification } from "~/modules/toastNotification";
import { normalize } from "~/utils/getWindowHeight";
import { X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";

interface Props {
  closeModal: () => void;
}

export const ModalAddCategory: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);

  const [addCategory, { loading }] = useMutation(ADD_INSPECTION_CATEGORY);

  const [selectedCategory, setSelectedCategory] = useState<OptionItem>(
    "Select Inspection Category"
  );
  const [categoryError, setCategoryError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [showDisplayNameInput, setShowDisplayNameInput] = useState(false);

  const categoryOptions = [
    "Call-for-Aid",
    "Ceiling",
    "Doors",
    "Electrical System",
    "Floors",
    "Health & Safety",
    "Hot Water Heater",
    "Living Room",
  ];

  const newCategory = {
    customerId: X_CUSTOMER_ID,
    siteId: X_SIDE_ID,
    inspectionTemplateId: inspectionItem?.templateId,
    name: displayName,
    isRequired: true,
    createdBy: profile?.email || "",
  };

  const handleAddNewCategory = async () => {
    if (selectedCategory === "Select Inspection Category") {
      setCategoryError("Inspection category required.");
      return;
    }

    if (!displayName || !displayName.trim()) {
      setDisplayNameError("Display Name required.");
      return;
    }

    try {
      await addCategory({
        variables: {
          command: newCategory,
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
      dispatch(
        actionsToastNotification.showToastMessage("Success! Category added.")
      );
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    if (selectedCategory !== "Select Inspection Category") {
      setCategoryError("");
      setShowDisplayNameInput(true);
    }

    if (displayName && displayName.trim()) {
      setDisplayNameError("");
    }
  }, [selectedCategory, displayName]);

  return (
    <Modal transparent={true}>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeModal();
        }}
      >
        <View
          style={styles.content}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(event) => {
            event.stopPropagation();
          }}
        >
          <Text style={styles.title}>Add Inspection Category</Text>
          <View style={{ height: categoryError ? normalize(160) : normalize(120) }}>
            <View style={styles.customSelectPosition}>
              <CustomSelect
                data={categoryOptions}
                selectedItem={selectedCategory}
                setSelectedItem={setSelectedCategory}
                maxHeight={"100%"}
                selectedItemColor={colors.blue}
                error={categoryError}
              />
            </View>
          </View>
          {showDisplayNameInput && (
            <View style={{ marginBottom: normalize(50), zIndex: -1 }}>
              <Text style={styles.title}>Display name</Text>
              <TextInput
                style={{
                  ...styles.displayNameInput,
                  borderColor: displayNameError ? colors.red : colors.primary,
                }}
                onChangeText={setDisplayName}
                value={displayName}
              />
              {displayNameError && (
                <Text style={styles.errorText}>{displayNameError}</Text>
              )}
            </View>
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={{ ...styles.button, borderColor: colors.blue }}
              onPress={closeModal}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddNewCategory}
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && <ModalLoader />}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    width: "85%",
    minHeight: "25%",
    justifyContent: "center",
  },
  title: {
    color: colors.primary,
    ...textStyles.medium,
    fontWeight: "600",
    zIndex: -1,
    marginBottom: "3%",
  },
  customSelectPosition: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: -2,
    marginTop: "3%",
  },
  button: {
    borderRadius: 40,
    borderWidth: 1,
    paddingVertical: "1%",
    width: "48%",
    textAlign: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: colors.layout,
    borderColor: colors.layout,
  },
  addText: {
    ...textStyles.regular,
    fontWeight: "600",
    color: "#fff",
  },
  cancelText: {
    ...textStyles.regular,
    fontWeight: "600",
    color: colors.blue,
  },
  displayNameInput: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: normalize(15),
    borderColor: colors.primary,
    marginTop: 15,
    zIndex: -1,
    ...textStyles.regular,
  },
  errorText: {
    color: colors.red,
    marginLeft: "5%",
    fontWeight: "600",
    marginTop: 5,
    zIndex: -1,
    ...textStyles.small,
  },
});

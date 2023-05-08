import React, { useEffect, useState } from "react";
import { Modal, View, Pressable, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "~/view/theme";
import { CustomSelect } from "../../Custom/CustomSelect";
import { Category } from "~/types/Category";
import { useAppDispatch } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";

interface Props {
  closeModal: () => void;
}

export const ModalAddCategory: React.FC<Props> = ({ closeModal }) => {
  const insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();

  const addNewCategory = (newCategory: Category) => dispatch(actionsInspectionItem.addCategory(newCategory));

  const [selectedCategory, setSelectedCategory] = useState("Select Inspection Category");
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
    title: displayName,
    status: "Incomplete",
    result: "No results yet",
    items: 0,
    photos: "No",
    categoryAdded: true,
  };

  const handleAddNewCategory = () => {
    if (selectedCategory === "Select Inspection Category") {
      setCategoryError("Inspection category required.");
    }

    if (!displayName || !displayName.trim()) {
      setDisplayNameError("Display Name required.");
    }

    if (
      selectedCategory === "Select Inspection Category" ||
      !displayName ||
      !displayName.trim()
    ) {
      return;
    }

    addNewCategory(newCategory);
    closeModal();
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
          <View style={{ height: 90 }}>
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
            <View style={{marginBottom: 40, zIndex: -1}}>
              <Text style={styles.title}>Display name</Text>
              <TextInput
                style={{
                  ...styles.displayNameInput,
                  borderColor: displayNameError ? colors.red : colors.primary,
                }}
                onChangeText={setDisplayName}
                value={displayName}
              />
              {displayNameError && <Text style={styles.errorText}>{displayNameError}</Text>}
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
    minHeight: "20%",
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600",
    zIndex: -1,
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
  },
  button: {
    borderRadius: 40,
    borderWidth: 1,
    paddingVertical: 5,
    width: "48%",
    textAlign: 'center',
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: colors.layout,
    borderColor: colors.layout,
  },
  addText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cancelText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.blue,
  },
  displayNameInput: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: colors.primary,
    marginTop: 15,
    zIndex: -1,
  },
  errorText: {
    color: colors.red,
    marginLeft: "5%",
    fontWeight: "600",
    marginTop: 5,
    zIndex: -1,
  },
});

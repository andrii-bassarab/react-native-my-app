import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Image,
} from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { SearchForm } from "../../Inspections/SearchForm";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { ModalAddCategory } from "../InspectionInspect/ModalAddCategory";
import { InspectionFilesAddButton } from "./InspectionFilesAddButton";
import { InspectionItem } from "~/types/InspectionItem";
import { InspectionFileCard } from "./InspectionFileCard";
import FileIcon from "~/view/assets/icons/file.svg";
import TakePhotoIcon from "~/view/assets/icons/takePhoto.svg";
import ImageGallery from "~/view/assets/icons/gallery.svg";
import { colors } from "~/view/theme";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { Asset, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { getInspectionDate } from "~/utils/visibleDate";

const mocksFiles = [
  {
    name: "Roof Warranty.pdf",
    uploadTime: "May 30, 2022 at 3:00pm",
    docFormat: "pdf",
  },
  {
    name: "Some Document.docx",
    uploadTime: "May 25, 2022 at 3:00pm",
    docFormat: "doc",
  },
  {
    name: "Some Document.csv",
    uploadTime: "May 24, 2021 at 3:00pm",
    docFormat: "csv",
  },
  {
    name: "Some Image.jpg",
    uploadTime: "May 22, 2021 at 3:00pm",
    docFormat: "jpg",
  },
  {
    name: "Some Image.png",
    uploadTime: "May 20, 2021 at 3:00pm",
    docFormat: "png",
  },
];

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionFilesView: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();

  // const addNewCategory = (newCategory: Category) => dispatch(actionsInspectionItem.addCategory(newCategory));
  const { categories } = useAppSelector((state) => state.inspectionItem);

  const [query, setQuery] = useState("");
  const [visibleFiles, setVisibleFiles] = useState(mocksFiles);
  const [showModalAddFile, setShowModalAddFile] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Asset | null>(null);

  useEffect(() => {
    setVisibleFiles(
      mocksFiles.filter((file) =>
        file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, mocksFiles]);

  const handleCloseModalAddFile = () => setShowModalAddFile(false);

  const handleTakePhoto = async () => {
    const result = await launchCamera({ mediaType: "photo" });
    handleCloseModalAddFile();

    if (
      result.assets &&
      Array.isArray(result.assets) &&
      typeof result.assets[0] === "object" &&
      result.assets[0].hasOwnProperty("uri")
    ) {
      const asset = result.assets[0];

      setNewPhoto(result.assets[0]);

      setVisibleFiles((prev) => [
        ...prev,
        {
          name: asset.fileName || "",
          docFormat: asset.fileName?.split(".")[1] || "",
          uploadTime: getInspectionDate(new Date()) || "",
        },
      ]);
    }

    console.log("handleTakePhoto", result);
  };

  const handleChoosePhoto = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    handleCloseModalAddFile();

    if (
      result.assets &&
      Array.isArray(result.assets) &&
      typeof result.assets[0] === "object" &&
      result.assets[0].hasOwnProperty("uri")
    ) {
      const asset = result.assets[0];

      setNewPhoto(result.assets[0]);

      setVisibleFiles((prev) => [
        ...prev,
        {
          name: asset.fileName || "",
          docFormat: asset.fileName?.split(".")[1] || "",
          uploadTime: getInspectionDate(new Date(), true) || "",
        },
      ]);
    }

    console.log("handleImageLibraryPhoto", result);
  };

  // console.log("PERMISSIONS", check(PERMISSIONS.ANDROID.CAMERA)
  // .then((result) => {
  //   switch (result) {
  //     case RESULTS.UNAVAILABLE:
  //       console.log('This feature is not available (on this device / in this context)');
  //       break;
  //     case RESULTS.DENIED:
  //       console.log('The permission has not been requested / is denied but requestable');
  //       break;
  //     case RESULTS.LIMITED:
  //       console.log('The permission is limited: some actions are possible');
  //       break;
  //     case RESULTS.GRANTED:
  //       console.log('The permission is granted');
  //       break;
  //     case RESULTS.BLOCKED:
  //       console.log('The permission is denied and not requestable anymore');
  //       break;
  //   }
  // }))

  console.log(newPhoto);

  return (
    <View style={styles.content}>
      <View style={{ padding: 2 }}>
        <SearchForm query={query} setQuery={setQuery} placeholder="Search File" />
      </View>
      <View style={{ height: 15 }} />
      <TouchableOpacity onPress={() => setShowModalAddFile(true)}>
        <InspectionFilesAddButton />
      </TouchableOpacity>
      <View style={{ height: 15 }} />
      {Platform.OS === "ios" ? (
        <View style={[styles.filesContainer, styles.shadowProp]}>
          {visibleFiles.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fileTitle}>Files</Text>
              {visibleFiles.map((file, index) => (
                <TouchableOpacity key={index} style={{ marginBottom: "4%" }}>
                  <InspectionFileCard file={file} />
                </TouchableOpacity>
              ))}
              <Image
                source={{
                  uri: newPhoto?.uri,
                }}
                style={{ height: 200, width: 200, resizeMode: "cover" }}
              />
              <View style={{ height: "5%" }} />
            </ScrollView>
          ) : (
            <View style={styles.noFilesFindContainer}>
              <FileIcon
                color={"rgba(142, 142, 142, 0.33)"}
                width={"40%"}
                height={"50%"}
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.noFilesFindText}>No files find</Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {visibleFiles.length > 0 ? (
            <ScrollView
              style={[styles.filesContainer, styles.shadowProp]}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.fileTitle}>Files</Text>
              {visibleFiles.map((file, index) => (
                <TouchableOpacity key={index} style={{ marginBottom: "4%" }}>
                  <InspectionFileCard file={file} />
                </TouchableOpacity>
              ))}
              <Image
                source={{
                  uri: newPhoto?.uri,
                }}
                style={{ height: 200, width: 200, resizeMode: "cover" }}
              />
              <View style={{ height: 20 }} />
            </ScrollView>
          ) : (
            <View style={styles.noFilesFindContainer}>
              <FileIcon
                color={"rgba(142, 142, 142, 0.33)"}
                width={"40%"}
                height={"50%"}
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.noFilesFindText}>No files find</Text>
            </View>
          )}
        </>
      )}
      {showModalAddFile && (
        <ModalSwipeScreen
          closeModalFunction={handleCloseModalAddFile}
          height={"50%"}
          percentSwipeToClose={0.2}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add File</Text>
            <View style={styles.modalPhotoButtons}>
              <View style={styles.fileButtonContainer}>
                <TouchableOpacity
                  style={[styles.fileButton, styles.shadowProp]}
                  onPress={handleTakePhoto}
                >
                  <TakePhotoIcon width={"60%"} height={"60%"} color={"#D7D7D7"} />
                </TouchableOpacity>
                <Text style={styles.fileButtonText}>Take photo</Text>
              </View>
              <View style={styles.fileButtonContainer}>
                <TouchableOpacity
                  style={[styles.fileButton, styles.shadowProp]}
                  onPress={handleChoosePhoto}
                >
                  <ImageGallery width={"60%"} height={"60%"} color={"#D7D7D7"} />
                </TouchableOpacity>
                <Text style={styles.fileButtonText}>Choose from Gallery</Text>
              </View>
              <View style={styles.fileButtonContainer}>
                <TouchableOpacity style={[styles.fileButton, styles.shadowProp]}>
                  <FileIcon width={"60%"} height={"60%"} color={"#D7D7D7"} />
                </TouchableOpacity>
                <Text style={styles.fileButtonText}>Add File From Documents</Text>
              </View>
            </View>
          </View>
        </ModalSwipeScreen>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 25,
  },
  fileTitle: {
    color: "#7F888D",
    fontSize: 20,
    marginBottom: "3%",
    fontWeight: "700",
  },
  filesContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: "3%",
    paddingVertical: "4%",
    marginBottom: "5%",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 8,
  },
  noFilesFindText: {
    color: "#7F888D",
    fontWeight: "600",
    fontSize: 18,
    marginTop: "5%",
  },
  noFilesFindContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    alignItems: "stretch",
    flex: 1,
    marginTop: "10%",
  },
  modalTitle: {
    color: colors.darkGrey,
    fontSize: 20,
    fontWeight: "600",
  },
  modalPhotoButtons: {
    flexDirection: "row",
    flex: 1,
  },
  fileButton: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  fileButtonText: {
    textAlign: "center",
    color: colors.textGrey,
    fontWeight: "400",
    fontSize: 13,
    marginTop: "7%",
  },
  fileButtonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "20%",
  },
});

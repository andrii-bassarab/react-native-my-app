import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Platform } from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { SearchForm } from "../../Inspections/SearchForm";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionFilesAddButton } from "./InspectionFilesAddButton";
import { InspectionItem } from "~/types/InspectionItem";
import { InspectionFileCard } from "./InspectionFileCard";
import FileIcon from "~/view/assets/icons/file.svg";
import TakePhotoIcon from "~/view/assets/icons/takePhoto.svg";
import ImageGallery from "~/view/assets/icons/gallery.svg";
import { colors } from "~/view/theme";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { Asset, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { getInspectionDate } from "~/utils/visibleDate";
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from "react-native-document-picker";
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes";
import { generateUniqueId } from "~/utils/genereteUniqueId";
import { ModalViewImage } from "../../CategoryView/ModalViewImage";

export interface File {
  id: string;
  fileName: string;
  uploadTime: string;
  docFormat: string;
  uri?: string;
}

const mocksFiles: File[] = [
  {
    id: generateUniqueId(),
    fileName: "Roof Warranty.pdf",
    uploadTime: "May 30, 2022 at 3:00pm",
    docFormat: "pdf",
  },
  {
    id: generateUniqueId(),
    fileName: "Some Document.docx",
    uploadTime: "May 25, 2022 at 3:00pm",
    docFormat: "doc",
  },
  {
    id: generateUniqueId(),
    fileName: "Some Document.csv",
    uploadTime: "May 24, 2021 at 3:00pm",
    docFormat: "csv",
  },
  {
    id: generateUniqueId(),
    fileName: "Some Image.jpg",
    uploadTime: "May 22, 2021 at 3:00pm",
    docFormat: "jpg",
  },
  {
    id: generateUniqueId(),
    fileName: "Some Image.png",
    uploadTime: "May 20, 2021 at 3:00pm",
    docFormat: "png",
  },
];

const mocksSignatures = [
  {
    id: generateUniqueId(),
    fileName: "Inspector.png",
    uploadTime: "May 30, 2023 at 3:00pm",
    docFormat: "png",
  },
  {
    id: generateUniqueId(),
    fileName: "Landlord.png",
    uploadTime: "May 25, 2023 at 3:00pm",
    docFormat: "png",
  },
  {
    id: generateUniqueId(),
    fileName: "Tenant.png",
    uploadTime: "May 24, 2023 at 3:00pm",
    docFormat: "png",
  },
];

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionFilesView: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [visibleFiles, setVisibleFiles] = useState(mocksFiles);
  const [showModalAddFile, setShowModalAddFile] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Asset | null>(null);
  const [newFile, setNewFile] = useState<DocumentPickerResponse | null>(null);
  const [showModalImage, setShowModalImage] = useState(false);

  useEffect(() => {
    setVisibleFiles(
      mocksFiles.filter((file) =>
        file.fileName.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, mocksFiles]);

  const handleCloseModalAddFile = () => setShowModalAddFile(false);

  const handleTakePhoto = async () => {
    try {
      const takenPhoto = await launchCamera({ mediaType: "photo" });
      handleCloseModalAddFile();

      if (
        takenPhoto.assets &&
        Array.isArray(takenPhoto.assets) &&
        typeof takenPhoto.assets[0] === "object" &&
        takenPhoto.assets[0].hasOwnProperty("uri")
      ) {
        const asset = takenPhoto.assets[0];

        setNewPhoto(takenPhoto.assets[0]);

        setVisibleFiles((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            fileName: asset.fileName || "",
            docFormat: asset.fileName?.split(".")[1] || "",
            uploadTime: getInspectionDate(new Date(), true) || "",
            uri: asset.uri,
          },
        ]);
      }

      console.log("handleTakePhoto:", takenPhoto);
    } catch (e) {
      console.log("TakenPhotoError:", e);
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const chosenImageFromGallery = await launchImageLibrary({ mediaType: "photo" });
      handleCloseModalAddFile();

      if (
        chosenImageFromGallery.assets &&
        Array.isArray(chosenImageFromGallery.assets) &&
        typeof chosenImageFromGallery.assets[0] === "object" &&
        chosenImageFromGallery.assets[0].hasOwnProperty("uri")
      ) {
        const asset = chosenImageFromGallery.assets[0];

        setNewPhoto(chosenImageFromGallery.assets[0]);

        setVisibleFiles((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            fileName: asset.fileName || "",
            docFormat: asset.fileName?.split(".")[1] || "",
            uploadTime: getInspectionDate(new Date(), true) || "",
            uri: asset.uri,
          },
        ]);
      }

      console.log("handleImageLibraryPhoto", chosenImageFromGallery);
    } catch (e) {
      console.log("ImageLibraryPhotoError", e);
    }
  };

  const handleSelectFile = async () => {
    try {
      const optionsDocumentPicker: DocumentPickerOptions<SupportedPlatforms> = {
        type:
          Platform.OS === "android"
            ? [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/csv",
              ]
            : ["UTTypePDF", "UTTypeRTFD", "UTTypeFlatRTFD"],
      };

      const arrayOfSelectedFile = await DocumentPicker.pick(optionsDocumentPicker);

      if (
        arrayOfSelectedFile &&
        Array.isArray(arrayOfSelectedFile) &&
        arrayOfSelectedFile[0].hasOwnProperty("uri")
      ) {
        handleCloseModalAddFile();
        const selectedFile = arrayOfSelectedFile[0];

        setNewFile(selectedFile);

        setVisibleFiles((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            fileName: selectedFile.name || "",
            docFormat: selectedFile.type?.split("/")[1] || "",
            uploadTime: getInspectionDate(new Date(), true) || "",
          },
        ]);
      }

      console.log("chosenFile", arrayOfSelectedFile);
    } catch (e) {
      console.log("DocumentPickerError", e);
    }
  };

  const handleDeleteFile = (fileToDelete: File) => {
    setVisibleFiles((prev) => prev.filter((file) => file.id !== fileToDelete.id));
  };

  const handleOpenModalImage = (fileToOpen: File) => {
    switch (fileToOpen.docFormat) {
      case 'png':
      case 'jpg':
        setNewPhoto(fileToOpen);
        setShowModalImage(true);
    }
  }

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
      <View style={[styles.filesContainer, styles.shadowProp]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {visibleFiles.length > 0 ? (
            <>
              <Text style={styles.fileTitle}>Files</Text>
              {visibleFiles.map((file) => (
                <TouchableOpacity key={file.id} style={{ marginBottom: "4%" }} onPress={() => handleOpenModalImage(file)}>
                  <InspectionFileCard file={file} deleteFile={handleDeleteFile} displayDeleteIcon />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.noFilesFindContainer}>
              <FileIcon
                color={"rgba(142, 142, 142, 0.33)"}
                width={100}
                height={100}
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.noFilesFindText}>No files find</Text>
            </View>
          )}
          <View style={styles.separator} />
          <Text style={styles.fileTitle}>Signatures</Text>
          {mocksSignatures.length < 0 ? (
            <>
              {mocksSignatures.map((file, index) => (
                <TouchableOpacity key={index} style={{ marginBottom: "4%" }}>
                  <InspectionFileCard file={file} deleteFile={handleDeleteFile} />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text style={[styles.fileTitle, styles.noSignatureFoundText]}>
              No Signatures Found.
            </Text>
          )}
        </ScrollView>
      </View>
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
                <TouchableOpacity
                  style={[styles.fileButton, styles.shadowProp]}
                  onPress={handleSelectFile}
                >
                  <FileIcon width={"60%"} height={"60%"} color={"#D7D7D7"} />
                </TouchableOpacity>
                <Text style={styles.fileButtonText}>Add File From Documents</Text>
              </View>
            </View>
          </View>
        </ModalSwipeScreen>
      )}
      {showModalImage && (
        <ModalViewImage closeModalFunction={() => setShowModalImage(false)} image={newPhoto} />
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
    fontWeight: "600",
  },
  filesContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingLeft: "4%",
    paddingRight: "1%",
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
    paddingVertical: "10%",
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
  separator: {
    height: 1,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    width: "95%",
    alignSelf: "center",
    marginVertical: "3%",
  },
  noSignatureFoundText: {
    marginTop: "6%",
    marginBottom: "10%",
    alignSelf: "center",
    fontSize: 18,
  },
});

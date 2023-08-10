import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
} from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { SearchForm } from "../../Inspections/SearchForm";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionFilesAddButton } from "./InspectionFilesAddButton";
import { InspectionItem } from "~/types/InspectionItem";
import { InspectionFileCard } from "./InspectionFileCard";
import FileIcon from "~/view/assets/icons/file.svg";
import TakePhotoIcon from "~/view/assets/icons/takePhoto.svg";
import ImageGallery from "~/view/assets/icons/gallery.svg";
import { colors, textStyles } from "~/view/theme";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { Asset, launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker, { DocumentPickerOptions } from "react-native-document-picker";
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes";
import { ModalViewImage } from "../../CategoryView/ModalViewImage";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/getWindowHeight";
import { ModalLoader } from "../../Loader/ModalLoader";
import FileViewer from "react-native-file-viewer";
import { uploadFile } from "~/services/api/files/uploadFile";
import { getInspectionFiles } from "~/services/api/files/getInspectionFiles";
import { fetchInspectionFiles } from "~/modules/inspectionFiles";
import { ContentLoader } from "../../Loader/Loader";
import { actionsToastNotification } from "~/modules/toastNotification";
import { openFile } from "~/utils/readDocument";
import { InspectionFileModalDocument } from "./InspectionFileModalDocument";
import { BASE_DOCUMENT_API } from "~/constants/env";
import { InspectionFile } from "~/types/InspectionFile";
import { requestDeleteFile } from "~/services/api/files/deleteFile";

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionFilesView: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { [inspectionItem.id]: currentInspectionFiles } = useAppSelector(
    (state) => state.inspectionFiles
  );

  const currentDocuments = (currentInspectionFiles?.files || []).filter(
    (file) =>
      (file?.metadata?.documentFormat === "image" ||
        file?.metadata?.documentFormat === "document") &&
      !file?.metadata?.fileRelatedToCategoryInspection
  );
  const currentSignatures = (currentInspectionFiles?.files || []).filter(
    (file) => file?.metadata?.documentFormat === "signature"
  );

  const { profile } = useAppSelector((state) => state.user);

  const [loader, setLoader] = useState(false);
  const [query, setQuery] = useState("");
  const [visibleFiles, setVisibleFiles] = useState(currentDocuments);
  const [showModalAddFile, setShowModalAddFile] = useState(false);
  const [newPhoto, setNewPhoto] = useState<InspectionFile | null>(null);
  const [showModalImage, setShowModalImage] = useState(false);
  const [showModalDocument, setShowModalDocument] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<InspectionFile | null>(null);

  useEffect(() => {
    setVisibleFiles(
      currentDocuments?.filter((file) =>
        file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, inspectionItem.id, currentInspectionFiles?.files]);

  // @ts-ignore
  const callFetchInspectionFiles = async () => dispatch(fetchInspectionFiles(inspectionItem.id));

  useEffect(() => {
    if (inspectionItem.id && !currentInspectionFiles) {
      callFetchInspectionFiles();
    }
  }, [inspectionItem.id]);

  const handleCloseModalAddFile = () => setShowModalAddFile(false);

  function getUrlExtension(url: string, name: string | number) {
    return Platform.OS === "ios"
      ? url.split(/[#?]/)[0].split(".").pop()?.trim() || ""
      : String(name).split(".")[1];
  }

  const handleFileViewerOpenFile = async (fileToOpen: InspectionFile) => {
    try {
      setLoader(true);
      await openFile(fileToOpen, () => setLoader(false));
    } catch (e) {
      console.log("error display file", e);
      setLoader(false);
    }
  };

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

        setLoader(true);

        await uploadFile({
          singleFile: asset,
          inspectionId: inspectionItem.id,
          email: profile?.email || "",
          documentType: "Image",
        });

        await callFetchInspectionFiles();

        dispatch(actionsToastNotification.showToastMessage("Success! File uploaded"));
      }

      console.log("handleTakePhoto:", takenPhoto);
    } catch (e) {
      console.log("TakenPhotoError:", e);
      Alert.alert("Failed to upload document");
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const chosenImageFromGallery = await launchImageLibrary({
        mediaType: "photo",
      });
      handleCloseModalAddFile();

      if (
        chosenImageFromGallery.assets &&
        Array.isArray(chosenImageFromGallery.assets) &&
        typeof chosenImageFromGallery.assets[0] === "object" &&
        chosenImageFromGallery.assets[0].hasOwnProperty("uri")
      ) {
        const asset = chosenImageFromGallery.assets[0];

        setLoader(true);

        await uploadFile({
          singleFile: asset,
          inspectionId: inspectionItem.id,
          email: profile?.email || "",
          documentType: "Image",
        });

        await callFetchInspectionFiles();

        dispatch(actionsToastNotification.showToastMessage("Success! Image uploaded"));
      }
    } catch (e) {
      console.log("ImageLibraryPhotoError", e);
      Alert.alert("Failed to upload document");
    } finally {
      setLoader(false);
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

      const arrayOfSelectedFile = await DocumentPicker.pick();

      if (
        arrayOfSelectedFile &&
        Array.isArray(arrayOfSelectedFile) &&
        arrayOfSelectedFile[0].hasOwnProperty("uri")
      ) {
        handleCloseModalAddFile();
        const selectedFile = arrayOfSelectedFile[0];

        setLoader(true);

        try {
          await uploadFile({
            singleFile: selectedFile,
            inspectionId: inspectionItem.id,
            email: profile?.email || "",
            documentType: "Document",
          });
        } catch {
          Alert.alert("Failed to upload document");
        }

        await callFetchInspectionFiles();

        dispatch(actionsToastNotification.showToastMessage("Success! File uploaded"));
      }
    } catch (e) {
      console.log("DocumentPickerError", e);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteFile = async (fileToDelete: InspectionFile) => {
    try {
      setLoader(true);
      await requestDeleteFile(fileToDelete.id);
      setLoader(false);
      await callFetchInspectionFiles();
    } catch (e) {
      setLoader(false);
      console.log("Failed to delete file", e);
      Alert.alert("Failed to delete file");
    }
  };

  const handleOpenModalFile = (fileToOpen: InspectionFile) => {
    switch (fileToOpen.extension.toLocaleLowerCase()) {
      case "png":
      case "jpg":
      case "jpeg":
        setNewPhoto(fileToOpen);
        setShowModalImage(true);
        return;
      case "pdf":
        setSelectedPDFFile(fileToOpen);
        setShowModalDocument(true);
        return;
      default:
        handleFileViewerOpenFile(fileToOpen);
    }
  };

  return (
    <View style={styles.content}>
      <View style={{ padding: 2 }}>
        <SearchForm query={query} setQuery={setQuery} placeholder="Search File" />
      </View>
      <View style={{ height: "2%" }} />
      {inspectionItem?.status !== InspectionStatus.COMPLETE && (
        <TouchableOpacity onPress={() => setShowModalAddFile(true)}>
          <InspectionFilesAddButton />
        </TouchableOpacity>
      )}
      <View style={{ height: 15 }} />
      <View style={[styles.filesContainer, styles.shadowProp]}>
        {currentInspectionFiles?.loading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <ContentLoader size="large" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {currentInspectionFiles?.files &&
              !currentInspectionFiles?.loading &&
              visibleFiles.length > 0 && (
                <>
                  <Text style={styles.fileTitle}>Files</Text>
                  {visibleFiles.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      style={{ marginBottom: "4%" }}
                      onPress={() => handleOpenModalFile(file)}
                    >
                      <InspectionFileCard
                        file={file}
                        deleteFile={handleDeleteFile}
                        displayDeleteIcon={inspectionItem?.status !== InspectionStatus.COMPLETE}
                      />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            {currentInspectionFiles?.files &&
              !currentInspectionFiles?.loading &&
              visibleFiles.length === 0 && (
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
            {!currentInspectionFiles?.loading && <View style={styles.separator} />}
            {!currentInspectionFiles?.loading && <Text style={styles.fileTitle}>Signatures</Text>}
            {currentSignatures.length > 0 && !currentInspectionFiles?.loading && (
              <>
                {currentSignatures.map((file, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ marginBottom: "4%" }}
                    onPress={() => handleOpenModalFile(file)}
                  >
                    <InspectionFileCard
                      file={file}
                      deleteFile={handleDeleteFile}
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
            {currentSignatures.length === 0 && !currentInspectionFiles?.loading && (
              <Text style={[styles.fileTitle, styles.noSignatureFoundText]}>
                No Signatures Found.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
      {showModalAddFile && (
        <ModalSwipeScreen
          closeModalFunction={handleCloseModalAddFile}
          height={"45%"}
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
                  <FileIcon width={normalize(50)} height={normalize(50)} color={"#D7D7D7"} />
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
      {showModalDocument && (
        <InspectionFileModalDocument
          uri={`${BASE_DOCUMENT_API}/files/${selectedPDFFile?.id || ""}`}
          closeModalFunction={() => setShowModalDocument(false)}
        />
      )}
      {loader && <ModalLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  contentb: {
    backgroundColor: "#fff",
    height: "90%",
    width: "100%",
    opacity: 1,
    paddingHorizontal: "2%",
    paddingVertical: "10%",
    paddingBottom: "11%",
    borderRadius: 15,
    justifyContent: "space-between",
  },
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: "7%",
  },
  fileTitle: {
    color: "#7F888D",
    marginBottom: "3%",
    fontWeight: "600",
    ...textStyles.strong,
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
    marginTop: "5%",
    ...textStyles.regular,
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
    paddingHorizontal: normalize(20),
  },
  modalTitle: {
    color: colors.darkGrey,
    fontWeight: "600",
    ...textStyles.large,
  },
  modalPhotoButtons: {
    flexDirection: "row",
    flex: 1,
  },
  fileButton: {
    height: normalize(150),
    width: normalize(150),
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
    marginTop: "7%",
    ...textStyles.little,
  },
  fileButtonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
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
    ...textStyles.regular,
  },
});

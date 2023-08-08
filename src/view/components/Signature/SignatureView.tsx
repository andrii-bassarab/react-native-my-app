import React, { memo, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from "react-native";
import { SignatureCard } from "./SignatureCard";
import { ModalSwipeScreen } from "../Custom/ModalSwipeScreen";
import SignatureCapture, { SaveEventParams } from "react-native-signature-capture";
import { colors, textStyles } from "~/view/theme";
import { actionsToastNotification } from "~/modules/toastNotification";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionItem } from "~/types/InspectionItem";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { uploadFile } from "~/services/api/uploadFile";
import { Asset } from "react-native-image-picker";
import { getVisibleDate } from "~/utils/visibleDate";
import { ModalLoader } from "../Loader/ModalLoader";
import { ContentLoader } from "../Loader/Loader";
import { BASE_DOCUMENT_API, FILEROOM_API_KEY } from "~/constants/env";
import { fetchInspectionFiles } from "~/modules/inspectionFiles";

interface Props {
  inspection: InspectionItem;
}

export const SignatureView: React.FC<Props> = ({ inspection }) => {
  const ref = useRef<SignatureCapture>(null);
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((state) => state.user);
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);

  const { [inspectionItem.id]: currentInspectionFiles } = useAppSelector(
    (state) => state.inspectionFiles
  );

  // @ts-ignore
  const callFetchInspectionFiles = async () => dispatch(fetchInspectionFiles(inspectionItem.id));

  const currentSignatures = (currentInspectionFiles?.files || []).filter(
    (file) => file?.metadata?.documentFormat === "signature"
  );

  const [loader, setLoader] = useState(false);
  const [loaderImage, setImageLoader] = useState(false);
  const [showSignModalScreen, setShowSignModalScreen] = useState(false);
  const [currentPathNumber, setCurrentPathNumber] = useState<number | null>(null);
  const [startSignatureDraw, setStartSignatureDraw] = useState(false);
  const [showViewSignature, setShowViewSignature] = useState(false);

  useEffect(() => {
    callFetchInspectionFiles();
  }, []);

  const pathSignInspector = currentSignatures.find(
    (file) => file.metadata?.signaturePosition === "Inspector"
  );
  const pathSignLandlord = currentSignatures.find(
    (file) => file.metadata?.signaturePosition === "Landlord"
  );
  const pathSignTenant = currentSignatures.find(
    (file) => file.metadata?.signaturePosition === "Tenant"
  );

  useEffect(() => {
    if (pathSignTenant && pathSignLandlord && pathSignInspector) {
      dispatch(actionsInspectionItem.setSignatureCount(3));
    } else {
      dispatch(actionsInspectionItem.setSignatureCount(0));
    }
  }, [pathSignInspector, pathSignLandlord, pathSignTenant]);

  const onSaveEvent = async (result: SaveEventParams) => {
    try {
      setShowSignModalScreen(false);
      setStartSignatureDraw(false);

      setLoader(true);
      await uploadFile({
        singleFile: {
          fileName: `Signature ${getVisibleDate(new Date())}.png`,
          uri: result.pathName,
          type: "image/png",
        } as Asset,
        inspectionId: inspection.id,
        email: profile?.email || "",
        documentType: "Signature",
        signaturePosition:
          currentPathNumber === 0 ? "Inspector" : currentPathNumber === 1 ? "Landlord" : "Tenant",
      });
      await callFetchInspectionFiles();
      dispatch(actionsToastNotification.showToastMessage("Success! Signature saved."));

      //result.encoded - for the base64 encoded png
      //result.pathName - for the file path name
    } catch (e) {
      console.log("error upload signature", e);
      Alert.alert("failed to upload signature");
    } finally {
      setLoader(false);
    }
  };

  const handleResetSign = () => {
    ref?.current?.resetImage();
  };

  const handleSaveSign = async () => {
    ref?.current?.saveImage();
  };

  const handleOpenSignatureCapture = (currentNum: number) => {
    setShowSignModalScreen(true);

    setCurrentPathNumber(currentNum);
  };

  const handleOpenModalSignature = (currentNum: number) => {
    setShowViewSignature(true);
    setCurrentPathNumber(currentNum);
  };

  const detectCurrentImagePath = () => {
    switch (currentPathNumber) {
      case 0:
        return <ImageInspector />;
      case 1:
        return <ImageLandlord />;
      case 2:
        return <ImageTenant />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!showSignModalScreen) {
      setStartSignatureDraw(false);
    }
  }, [showSignModalScreen]);

  const ImageInspector = memo(() => {
    if (!pathSignInspector) return null;

    return (
      <Image
        source={{
          uri: `${BASE_DOCUMENT_API}/files/${pathSignInspector.id || ""}`,
          headers: {
            "x-api-key": FILEROOM_API_KEY,
          },
        }}
        style={[styles.imageviewSignature]}
      />
    );
  });

  const ImageLandlord = memo(() => {
    if (!pathSignLandlord) return null;

    return (
      <Image
        source={{
          uri: `${BASE_DOCUMENT_API}/files/${pathSignLandlord.id || ""}`,
          headers: {
            "x-api-key": FILEROOM_API_KEY,
          },
        }}
        style={[styles.imageviewSignature]}
      />
    );
  });

  const ImageTenant = memo(() => {
    if (!pathSignTenant) return null;

    return (
      <Image
        source={{
          uri: `${BASE_DOCUMENT_API}/files/${pathSignTenant.id || ""}`,
          headers: {
            "x-api-key": FILEROOM_API_KEY,
          },
        }}
        style={[styles.imageviewSignature]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signatures & Approvals</Text>
      {currentInspectionFiles.loading && !loader ? (
        <ContentLoader size="large" />
      ) : (
        <>
          <SignatureCard
            position={"Inspector"}
            name={inspection.visibleAssignedTo}
            openSignScreen={() => handleOpenSignatureCapture(0)}
            signaturePath={pathSignInspector}
            openShowViewSignature={() => handleOpenModalSignature(0)}
          />
          <SignatureCard
            position={"Landlord"}
            name={`Tim O’Reilly`}
            openSignScreen={() => handleOpenSignatureCapture(1)}
            signaturePath={pathSignLandlord}
            openShowViewSignature={() => handleOpenModalSignature(1)}
          />
          <SignatureCard
            position={"Tenant"}
            name={inspection.visibleHouseholdName}
            openSignScreen={() => handleOpenSignatureCapture(2)}
            signaturePath={pathSignTenant}
            openShowViewSignature={() => handleOpenModalSignature(2)}
          />
        </>
      )}
      {showSignModalScreen && (
        <ModalSwipeScreen
          closeModalFunction={() => setShowSignModalScreen(false)}
          height={"70%"}
          percentSwipeToClose={0.2}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sign</Text>
            <Text style={styles.modalInfo}>Add your signature here</Text>
            <View style={styles.signatureCaptureContainer}>
              <SignatureCapture
                ref={ref}
                style={{ flex: 1 }}
                showNativeButtons={false}
                showBorder={false}
                onSaveEvent={onSaveEvent}
                onTouchStart={() => setStartSignatureDraw(true)}
                saveImageFileInExtStorage={true}
              />
            </View>
            <View style={styles.buttonsContainer}>
              {startSignatureDraw && (
                <TouchableOpacity style={styles.buttonSign} onPress={() => handleResetSign()}>
                  <Text style={styles.buttonSignText}>Clear</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleSaveSign}
                style={{ ...styles.buttonSign, opacity: !startSignatureDraw ? 0.5 : 1 }}
                disabled={!startSignatureDraw}
              >
                <Text style={styles.buttonSignText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalSwipeScreen>
      )}
      {showViewSignature && currentPathNumber !== null && (
        <ModalSwipeScreen
          closeModalFunction={() => setShowViewSignature(false)}
          height={"70%"}
          percentSwipeToClose={0.2}
        >
          <View style={styles.modalContainer}>{detectCurrentImagePath()}</View>
        </ModalSwipeScreen>
      )}
      {loader && <ModalLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "7%",
    paddingTop: "5%",
  },
  title: {
    color: "#7F888D",
    fontWeight: "600",
    ...textStyles.large,
  },
  modalContainer: {
    alignItems: "stretch",
    flex: 1,
    marginTop: "10%",
  },
  modalTitle: {
    color: "#7F888D",
    ...textStyles.large,
    fontWeight: "600",
  },
  modalInfo: {
    color: "#7F888D",
    ...textStyles.medium,
    fontWeight: "600",
    marginTop: "5%",
    marginBottom: 5,
  },
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1,
  },
  signatureCaptureContainer: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(180, 188, 192, 1)",
    padding: 5,
    marginBottom: "10%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "5%",
  },
  buttonSign: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.layout,
    width: "40%",
    alignItems: "center",
    backgroundColor: colors.layout,
    paddingVertical: 5,
    marginLeft: "5%",
  },
  buttonSignText: {
    color: "#fff",
    ...textStyles.regular,
    fontWeight: "600",
  },
  imageviewSignature: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(180, 188, 192, 1)",
    resizeMode: "contain",
  },
});

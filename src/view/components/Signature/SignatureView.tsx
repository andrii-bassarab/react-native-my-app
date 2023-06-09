import React, { memo, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { SignatureCard } from "./SignatureCard";
import { ModalSwipeScreen } from "../Custom/ModalSwipeScreen";
import SignatureCapture, { SaveEventParams } from "react-native-signature-capture";
import { colors, textStyles } from "~/view/theme";
import { actionsToastNotification } from "~/modules/toastNotification";
import { useAppDispatch } from "~/store/hooks";
import { InspectionItem } from "~/types/InspectionItem";
import { actionsInspectionItem } from "~/modules/inspectionItem";

interface Props {
  inspection: InspectionItem
}

export const SignatureView: React.FC<Props> = ({inspection}) => {
  const ref = useRef<SignatureCapture>(null);
  const dispatch = useAppDispatch();

  const [showSignModalScreen, setShowSignModalScreen] = useState(false);
  const [pathSignInspector, setPathSignInspector] = useState("");
  const [pathSignLandlord, setPathSignLandlord] = useState("");
  const [pathSignTenant, setPathSignTenant] = useState("");
  const [currentPathNumber, setCurrentPathNumber] = useState<number | null>(null);
  const [startSignatureDraw, setStartSignatureDraw] = useState(false);
  const [showViewSignature, setShowViewSignature] = useState(false);


  useEffect(() => {
    if (pathSignTenant && pathSignLandlord && pathSignInspector) {
      dispatch(actionsInspectionItem.setSignatureCount(3))
    } else {
      dispatch(actionsInspectionItem.setSignatureCount(0))
    }
  }, [pathSignInspector, pathSignLandlord, pathSignTenant])

  // console.log("pathSignInspector",pathSignInspector)

  const onSaveEvent = (result: SaveEventParams) => {
    setStartSignatureDraw(false);
    setShowSignModalScreen(false);
    dispatch(actionsToastNotification.showToastMessage("Success! Signature saved."));

    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name

    switch (currentPathNumber) {
      case 0:
        setPathSignInspector(Platform.OS === "ios" ? result.pathName : `data:image/png;base64,${result.encoded}`)
        return;
      case 1:
        setPathSignLandlord(Platform.OS === "ios" ? result.pathName : `data:image/png;base64,${result.encoded}`);
        return;
      case 2:
        setPathSignTenant(Platform.OS === "ios" ? result.pathName : `data:image/png;base64,${result.encoded}`);
        return;
    }
  };

  const handleResetSign = () => {
    ref?.current?.resetImage();
  };

  const handleSaveSign = () => {
    ref?.current?.saveImage();
  };

  const handleOpenSignatureCapture = (currentNum: number) => {
    setShowSignModalScreen(true);

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
        source={{ uri: pathSignInspector }}
        style={[styles.imageviewSignature, { display: currentPathNumber === 0 ? "flex" : "none" }]}
      />
    );
  });

  const ImageLandlord = memo(() => {
    if (!pathSignLandlord) return null;

    return (
      <Image
        source={{ uri: pathSignLandlord }}
        style={[styles.imageviewSignature, { display: currentPathNumber === 1 ? "flex" : "none" }]}
      />
    );
  });

  const ImageTenant = memo(() => {
    if (!pathSignTenant) return null;

    return (
      <Image
        source={{ uri: pathSignTenant }}
        style={[styles.imageviewSignature, { display: currentPathNumber === 2 ? "flex" : "none" }]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signatures & Approvals</Text>
      <SignatureCard
        position={"Inspector"}
        name={"Mildred Jones"}
        openSignScreen={() => handleOpenSignatureCapture(0)}
        signaturePath={pathSignInspector}
        openShowViewSignature={() => setShowViewSignature(true)}
      />
      <SignatureCard
        position={"Landlord"}
        name={`Tim O’Reilly${inspection.unit.landlord?.firstName || ""} ${inspection.unit.landlord?.lastName || ""}`}
        openSignScreen={() => handleOpenSignatureCapture(1)}
        signaturePath={pathSignLandlord}
        openShowViewSignature={() => setShowViewSignature(true)}
      />
      <SignatureCard
        position={"Tenant"}
        name={inspection.visibleHouseholdName}
        openSignScreen={() => handleOpenSignatureCapture(2)}
        signaturePath={pathSignTenant}
        openShowViewSignature={() => setShowViewSignature(true)}
      />
      {/* <View style={{ flex: 1, flexDirection: "row" }}>
        {pathSignInspector && (
          <Image
            source={{ uri: pathSignInspector }}
            style={{ width: 100, height: 100, backgroundColor: "red" }}
          />
        )}
        {pathSignLandlord && (
          <Image
            source={{ uri: pathSignLandlord }}
            style={{ width: 100, height: 100, backgroundColor: "green" }}
          />
        )}
        {pathSignTenant && (
          <Image
            source={{ uri: pathSignTenant }}
            style={{ width: 100, height: 100, backgroundColor: "blue" }}
          />
        )}
      </View> */}
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
          <View style={styles.modalContainer}>
            <ImageInspector />
            <ImageLandlord />
            <ImageTenant />
          </View>
        </ModalSwipeScreen>
      )}
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

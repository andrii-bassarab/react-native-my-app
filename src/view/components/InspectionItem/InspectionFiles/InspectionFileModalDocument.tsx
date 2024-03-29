import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";
import CloseIcon from "~/view/assets/icons/failed.svg";
import Pdf, { Source } from "react-native-pdf";
import { ContentLoader } from "../../Loader/Loader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalize } from "~/utils/normalize/normalize";
import { textStyles } from "~/view/theme";
import FileViewer from "react-native-file-viewer";

interface Props {
  closeModalFunction: () => void;
  uri: string;
}

export const InspectionFileModalDocument: React.FC<Props> = ({
  closeModalFunction,
  uri,
}) => {
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(false);
  const insets = useSafeAreaInsets();

  const source: Source = {
    uri,
    cache: true,
    headers: {
      "x-api-key": "msd4Bui1M479NQmooBcUL7Xq4Ds5aAtV6UFfjNQd",
    },
  };

  return (
    <Modal transparent={true}>
      {
        <View style={{ ...styles.content, marginTop: insets.top }}>
          <View
            style={[{ flex: 1, justifyContent: "center" }, error && {alignItems: 'center'}]}
          >
            {loader && (
              <View
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  justifyContent: "center",
                  zIndex: 2,
                  transform: [{ translateY: normalize(-30) }],
                }}
              >
                <ContentLoader />
              </View>
            )}
            {error ? (
              <Text style={{ ...textStyles.xlarge, fontWeight: "600" }}>
                Cannot render file
              </Text>
            ) : (
              <Pdf
                fitPolicy={0}
                horizontal={false}
                trustAllCerts={false}
                style={{ flex: 1, backgroundColor: "#fff", paddingBottom: 50 }}
                source={source}
                onLoadComplete={() => (setLoader(false), setError(false))}
                onError={(error) => (
                  console.log("Cannot render PDF", error),
                  setLoader(false),
                  setError(true)
                )}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModalFunction}
          >
            <CloseIcon color={"#fff"} width={"60%"} height={"60%"} />
          </TouchableOpacity>
        </View>
      }
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    opacity: 1,
    paddingHorizontal: "7%",
    paddingVertical: "10%",
    borderRadius: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    borderRadius: 100,
    backgroundColor: "#BDBDBD",
    width: normalize(40),
    height: normalize(40),
    position: "absolute",
    right: "3%",
    top: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
});

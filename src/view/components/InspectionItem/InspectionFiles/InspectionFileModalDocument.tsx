import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Text,
  Dimensions
} from "react-native";
import CloseIcon from "~/view/assets/icons/failed.svg";
import { colors } from "~/view/theme";
import Pdf, { Source } from "react-native-pdf";
import { ContentLoader } from "../../Loader/Loader";

interface Props {
  closeModalFunction: () => void;
}

export const InspectionFileModalDocument: React.FC<Props> = ({
  closeModalFunction,
}) => {
  const [loader, setLoader] = useState(true);

  const source: Source = {
    uri: "https://xjnnqual9j.execute-api.us-west-2.amazonaws.com/dev/api/files/68",
    cache: true,
    headers: {
      "x-api-key": "msd4Bui1M479NQmooBcUL7Xq4Ds5aAtV6UFfjNQd",
    }
  };

  return (
    <Modal transparent={true}>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeModalFunction();
        }}
      >
        {
          <View
            style={styles.content}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(event) => {
              event.stopPropagation();
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              {loader && (
                <View style={{ position: "absolute", alignSelf: "center", justifyContent: 'center' }}>
                  <ContentLoader />
                </View>
              )}
              <Pdf
                   fitPolicy={0}
                   horizontal={false}
                   trustAllCerts={false}
                   style={{ flex: 1,       width:Dimensions.get('window').width - 20,
                  }}
                   source={source}
                   onPageChanged={(page, number) => {
                     console.log("page", page)
                     console.log("number", number)
                     
                    }}
                    onLoadComplete={() => {
                      console.log(`PDF rendered from ${source.uri}`);
                      setLoader(false);
                    }}
                    onError={(error) => console.log("Cannot render PDF", error)}
                    />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModalFunction}
            >
              <CloseIcon color={"#fff"} width={"60%"} height={"60%"} />
            </TouchableOpacity>
          </View>
        }
      </Pressable>
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
    height: "90%",
    width: "100%",
    opacity: 1,
    paddingHorizontal: "2%",
    paddingVertical: "10%",
    paddingBottom: "11%",
    borderRadius: 15,
    justifyContent: "space-between",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  closeButton: {
    borderRadius: 100,
    backgroundColor: "#BDBDBD",
    width: 25,
    height: 25,
    position: "absolute",
    right: "3%",
    top: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  fileNameText: {
    width: "90%",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "1%",
    color: colors.textGrey,
    fontWeight: "600",
  },
});

import React, { useEffect, useRef, useState } from "react"
import { RouteProp } from '@react-navigation/native';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native"
import { ModalLoader } from "../components/ModalLoader";

interface Props {
  children?: React.ReactNode
  route: RouteProp<{ params: { loader?: boolean } }, 'params'>
}

export const SplashScreen: React.FC<Props> = ({route}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [loader, setLoader] = useState(route.params?.loader || false)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()

    return () => {
      setLoader(false)
    }
  }, [])

  console.log(route?.params)

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.screenContainer}>
        <Animated.Image
          source={require("../assets/images/WhiteKansoLogo.png")}
          style={{ ...styles.logo, opacity: fadeAnim }}
        />
        {loader && (
          <ModalLoader />
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "rgba(35, 71, 99, 0.77)",
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    width: "80%",
    alignSelf: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 0.9,
  },
})

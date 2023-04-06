import React, { useState } from "react"
import { Dimensions, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface Props {
  children: React.ReactNode
}

export const Screen: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets()
  const dim = Dimensions.get("screen")

  if (dim.width >= dim.height) {
    return (
      <ScrollView
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
          backgroundColor: "rgba(35, 71, 99, 0.77)",
          flex: 1,
        }}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "rgba(35, 71, 99, 0.77)",
        flex: 1,
      }}
    >
      {children}
    </View>
  )
}

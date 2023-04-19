import React from 'react';
import { Svg, Path, Circle } from "react-native-svg";

interface Props {
  size: number
}

const CloseIcon: React.FC<Props> = ({size}) => {
  return (
    <Svg
      width={size || 64}
      height={size || 64}
      viewBox="0 0 64 64"
      fill="none"
    >
      <Circle cx="32" cy="32" r="32" fill="#EDEDED" />
      <Path d="M20.2891 19.6328L47 45" stroke="#979797" strokeWidth={5} strokeLinecap="round" />
      <Path d="M45.4297 19.3516L20 45" stroke="#979797" strokeWidth={5} strokeLinecap="round" />
    </Svg>
  );
}

export default CloseIcon;
import { normalize } from "~/utils/getWindowHeight";

const colors = {
  layout: 'rgba(35, 71, 99, 1)',
  primary: '#7F878B',
  blue: 'rgba(37, 192, 220, 1)',
  red: 'rgba(237, 106, 95, 1)',
  green: 'rgba(150, 191, 91, 1)',
  darkGrey: "#808080",
  textGrey: "#8E8E8E"
};

const layout = {
  padding: 20,
};

export const textStyles = {
  mini: {
    fontSize: normalize(20),
  },
  little: {
    fontSize: normalize(22),
  },
  small: {
    fontSize: normalize(24),
  },
  regular: {
    fontSize: normalize(26),
  },
  medium: {
    fontSize: normalize(28),
  },
  strong: {
    fontSize: normalize(30),
  },
  large: {
    fontSize: normalize(32),
  },
  xlarge: {
    fontSize: normalize(34),
  },
};


export { colors, layout };

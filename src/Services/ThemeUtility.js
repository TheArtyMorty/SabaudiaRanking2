import Styles from "../Styles";

export const GetStyle1FromTheme = () => {
  switch (global.Theme) {
    case "Orange":
      return Styles.Orange1;
    case "Green":
      return Styles.Green1;
    case "Blue":
    default:
      return Styles.Blue1;
  }
};

export const GetStyle2FromTheme = () => {
  switch (global.Theme) {
    case "Orange":
      return Styles.Orange2;
    case "Green":
      return Styles.Green2;
    case "Blue":
    default:
      return Styles.Blue2;
  }
};

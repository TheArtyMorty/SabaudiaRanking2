import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  Blue1: {
    backgroundColor: "#B7D0FF",
  },
  Blue2: {
    backgroundColor: "#3D589E",
  },
  Orange1: {
    backgroundColor: "#FFC961",
  },
  Orange2: {
    backgroundColor: "#F45421",
  },
  Green1: {
    backgroundColor: "#8CF697",
  },
  Green2: {
    backgroundColor: "#44A32C",
  },

  defaultText: {
    fontWeight: "normal",
    fontSize: 20,
  },

  boldText: {
    fontWeight: "bold",
    fontSize: 20,
  },

  defaultPicker: {
    fontWeight: "normal",
    fontSize: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 1,
    width: 200,
    margin: 5,
  },

  defaultInput: {
    fontWeight: "normal",
    backgroundColor: "white",
    fontSize: 20,
    width: 200,
    margin: 5,
  },

  defaultImage: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft: 10,
  },

  mainPageImage: {
    width: 250,
    height: 250,
  },

  scoreInput: {
    fontWeight: "bold",
    backgroundColor: "white",
    fontSize: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginLeft: 45,
    marginRight: 45,
  },

  defaultButton: {
    margin: 10,
    borderRadius: 5,
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
  },

  defaultScrollView: {
    backgroundColor: "#ffffff99",
    borderColor: "black",
    borderWidth: 2,
    margin: 10,
    borderRadius: 5,
    width: "95%",
  },

  defaultButtonContent: {
    color: "white",
    fontWeight: "normal",
    fontSize: 20,
  },

  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "top",
    width: "100%",
  },

  subContainer: {
    alignItems: "center",
    justifyContent: "top",
    backgroundColor: "#00000023",
    margin: 5,
    width: "80%",
  },

  optionsContainer: {
    alignItems: "center",
    backgroundColor: "#00000023",
    margin: 5,
    width: "90%",
  },

  playerRankingContainer: {
    alignItems: "center",
    justifyContent: "top",
    backgroundColor: "#00000023",
    margin: 5,
    width: "95%",
  },

  lineContainer: {
    flexDirection: "row",
    margin: 10,
  },
});

export default Styles;

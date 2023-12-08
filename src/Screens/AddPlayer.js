import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, TextInput, Alert, Image } from "react-native";
import { addPlayer } from "../Services/WebService.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";

function AddPlayerScreen({ navigation }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [pseudo, setPseudo] = useState("");

  const createPlayer = () => {
    if (pseudo != "") {
      addPlayer(lastName, firstName, pseudo);
      navigation.pop();
      Alert.alert(
        "Ajout réussi",
        `Le joueur ${pseudo} a été ajouté avec succès !`
      );
    } else {
      Alert.alert("Erreur", `Veuillez choisir un pseudo pour le joueur...`);
    }
  };

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <View style={Styles.lineContainer}>
        <Text style={Styles.defaultText}>Nom : </Text>
        <TextInput
          style={Styles.defaultInput}
          placeholder="..."
          onChangeText={(lastName) => setLastName(lastName)}
        ></TextInput>
      </View>
      <View style={Styles.lineContainer}>
        <Text style={Styles.defaultText}>Prénom : </Text>
        <TextInput
          style={Styles.defaultInput}
          placeholder="..."
          onChangeText={(firstName) => setFirstName(firstName)}
        ></TextInput>
      </View>
      <View style={Styles.lineContainer}>
        <Text style={Styles.defaultText}>Pseudo : </Text>
        <TextInput
          style={Styles.defaultInput}
          placeholder="..."
          onChangeText={(Pseudo) => setPseudo(Pseudo)}
        ></TextInput>
      </View>
      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={createPlayer}
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconPlus.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Créer le joueur</Text>
        </View>
      </View>
    </View>
  );
}

export default AddPlayerScreen;

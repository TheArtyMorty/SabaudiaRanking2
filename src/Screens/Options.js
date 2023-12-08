import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getClub, getPlayer, storePlayer } from "../Services/LocalService.js";
import { Picker } from "@react-native-picker/picker";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";
import { defaultPlayer } from "../Services/PlayerUtility.js";

function OptionsScreen({ navigation, route }) {
  const [club, setClub] = useState("");
  getClub().then((v) => {
    if (v != "") {
      setClub(v);
    }
  });

  const [theme, setTheme] = useState("Blue");
  const ChangeAppTheme = (t) => {
    global.Theme = t;
    route.params.setRefresh();
  };

  const [pageInit, setInit] = useState(false);
  if (!pageInit && global.theme != theme) {
    setTheme(global.Theme);
    setInit(true);
  }

  const [dbInitialized, setDBInitialized] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  const UpdatePlayerList = (data) => {
    let newData = [defaultPlayer];

    Object.values(data).forEach((player) => {
      newData.push({
        FirstName: player.FirstName,
        LastName: player.LastName,
        MMR: player.MMR,
        Pseudo: player.Pseudo,
        ID: player.Key,
      });
    });

    setPlayerList((previousData) =>
      newData.sort((a, b) => a.Pseudo.localeCompare(b.Pseudo))
    );
  };

  if (!dbInitialized) {
    const playersRef = ref(db, global.ClubPath + "/players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      UpdatePlayerList(data);
      setDBInitialized(true);
      getPlayer().then((id) => {
        if (id != "") {
          setPlayer(id);
        }
      });
    });
  }

  const GetPlayerList = () => {
    return playerList.map((p, index) => {
      return <Picker.Item label={p.Pseudo} value={p.ID} key={index} />;
    });
  };

  const [player, setPlayer] = useState("");

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <View style={Styles.optionsContainer}>
        <Text style={Styles.boldText}>Options du Club</Text>
        <Text style={Styles.boldText}>----------------</Text>
        <Text style={Styles.defaultText}>
          Vous êtes connecté au club {club}.
        </Text>
        <View
          style={[Styles.defaultButton, GetStyle2FromTheme()]}
          onTouchStart={() => {
            Alert.alert(
              "Déconnexion",
              "Vous allez vous déconnecter du club " +
                club +
                ". Confirmez vous?",
              [
                {
                  text: "Non",
                  onPress: () => {},
                },
                {
                  text: "Oui",
                  style: "cancel",
                  onPress: () => {
                    AsyncStorage.clear();
                    route.params.setRefresh();
                    navigation.pop();
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <View style={Styles.lineContainer}>
            <Image
              style={Styles.defaultImage}
              source={require("../../assets/IconLeave.png")}
            ></Image>
            <Text style={Styles.defaultButtonContent}>Quitter le club</Text>
          </View>
        </View>
      </View>

      <View style={Styles.optionsContainer}>
        <Text style={Styles.boldText}>Options d'interface</Text>
        <Text style={Styles.boldText}>----------------</Text>
        <Text style={Styles.defaultText}>Theme graphique :</Text>
        <Picker
          style={Styles.defaultPicker}
          selectedValue={theme}
          onValueChange={(itemValue) => {
            setTheme(itemValue);
            ChangeAppTheme(itemValue);
          }}
        >
          <Picker.Item label="Par défaut (Bleu)" value="Blue" />
          <Picker.Item label="Orange" value="Orange" />
        </Picker>
      </View>

      <View style={Styles.optionsContainer}>
        <Text style={Styles.boldText}>Options du joueur</Text>
        <Text style={Styles.boldText}>----------------</Text>
        <Text style={Styles.defaultText}>Qui êtes vous ? :</Text>
        <Picker
          style={Styles.defaultPicker}
          selectedValue={player}
          onValueChange={(itemValue, itemIndex) => {
            console.log(itemValue);
            setPlayer(itemValue);
            storePlayer(itemValue);
            route.params.setRefresh();
          }}
        >
          {GetPlayerList()}
        </Picker>
      </View>

      <Text style={Styles.defaultText}> </Text>
      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={() => navigation.pop()}
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconBack.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Retour</Text>
        </View>
      </View>
    </View>
  );
}

export default OptionsScreen;

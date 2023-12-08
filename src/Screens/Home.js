import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, Image } from "react-native";
import { getAdmin, getClub, getPlayer } from "../Services/LocalService.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import { defaultPlayer } from "../Services/PlayerUtility.js";

function HomeScreen({ navigation }) {
  const [isAdmin, setisAdmin] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(true);
  const [player, setPlayer] = useState(defaultPlayer);

  const OnPageLoaded = () => {
    getClub().then((v) => {
      if (v == "") {
        navigation.navigate("Choisissez votre club", {
          setRefresh: () => {
            setNeedRefresh(true);
          },
        });
      } else {
        global.ClubPath = v;
      }
    });
    getAdmin().then((v) => {
      if (v == "true") {
        setisAdmin(true);
      } else {
        setisAdmin(false);
      }
    });
    getPlayer().then((id) => {
      if (id != "") {
        console.log(id);
        const playersRef = ref(db, global.ClubPath + "/players/" + id);
        onValue(playersRef, (snapshot) => {
          const p = snapshot.val();
          console.log(p);
          setPlayer({
            FirstName: p.FirstName,
            LastName: p.LastName,
            MMR: p.MMR,
            Pseudo: p.Pseudo,
            ID: p.Key,
            Rank: 0,
          });
        });
      }
    });
  };

  if (needRefresh) {
    OnPageLoaded();
    setNeedRefresh(false);
  }

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <Image
        style={Styles.mainPageImage}
        source={require("../../assets/icon.png")}
      ></Image>
      <Text style={Styles.defaultText}>
        Bienvenue {player.ID != "" ? player.Pseudo : ""} !
      </Text>
      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={() => navigation.navigate("Ajouter un score")}
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconPlus.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Entrer un score</Text>
        </View>
      </View>

      {player.ID != "" && (
        <View
          style={[Styles.defaultButton, GetStyle2FromTheme()]}
          onTouchStart={() =>
            navigation.navigate("Page joueur", { playerID: player.ID })
          }
        >
          <View style={Styles.lineContainer}>
            <Image
              style={Styles.defaultImage}
              source={require("../../assets/IconPlayer.png")}
            ></Image>
            <Text style={Styles.defaultButtonContent}>Ma page</Text>
          </View>
        </View>
      )}

      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={() => navigation.navigate("Classement")}
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconRanking.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Classement</Text>
        </View>
      </View>

      {isAdmin && (
        <View
          onTouchStart={() => navigation.navigate("Ajouter un joueur")}
          style={[Styles.defaultButton, GetStyle2FromTheme()]}
        >
          <View style={Styles.lineContainer}>
            <Image
              style={Styles.defaultImage}
              source={require("../../assets/IconPlus.png")}
            ></Image>
            <Text style={Styles.defaultButtonContent}>Ajouter un joueur</Text>
          </View>
        </View>
      )}

      <Text style={Styles.defaultText}></Text>
      <Text style={Styles.defaultText}></Text>
      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={() =>
          navigation.navigate("Options", {
            setRefresh: () => {
              setNeedRefresh(true);
            },
          })
        }
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconOptions.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Options</Text>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;

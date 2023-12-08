import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, ScrollView, Image, TextInput } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";

function RankingsScreen({ navigation }) {
  const [dbInitialized, setDBInitialized] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  const UpdatePlayerList = (data) => {
    let newData = [];
    Object.values(data).forEach((player) => {
      newData.push({
        FirstName: player.FirstName,
        LastName: player.LastName,
        MMR: player.MMR,
        ID: player.Key,
        Pseudo: player.Pseudo,
        Rank: 0,
      });
    });

    setPlayerList((previousData) => newData);
  };

  if (!dbInitialized) {
    const playersRef = ref(db, global.ClubPath + "/players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      UpdatePlayerList(data);
      setDBInitialized(true);
    });
  }

  const GetPlayerList = () => {
    return playerList
      .sort((a, b) => b.MMR - a.MMR)
      .map((p, index) => {
        var newPlayer = p;
        newPlayer.Rank = index + 1;
        return newPlayer;
      })
      .filter((a) => a.Pseudo.indexOf(filter) >= 0)
      .map((p, index) => {
        return (
          <View
            style={Styles.playerRankingContainer}
            key={index}
            onTouchEnd={() =>
              navigation.navigate("Page joueur", { playerID: p.ID })
            }
          >
            <View style={Styles.lineContainer}>
              <Text style={Styles.boldText}>#{p.Rank} -</Text>
              <Text style={Styles.defaultText}>{p.Pseudo}</Text>
              <Text style={Styles.defaultText}> - {p.MMR} Pts -</Text>
            </View>
          </View>
        );
      });
  };

  const [filter, setFilter] = useState("");

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <Text style={Styles.boldText}>Classement : </Text>
      <View style={Styles.subContainer}>
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconSearch.png")}
          ></Image>
          <TextInput
            style={Styles.defaultInput}
            placeholder="..."
            onChangeText={(Pseudo) => setFilter(Pseudo)}
          ></TextInput>
        </View>
      </View>
      <ScrollView style={Styles.defaultScrollView}>
        {GetPlayerList()}
      </ScrollView>
    </View>
  );
}

export default RankingsScreen;

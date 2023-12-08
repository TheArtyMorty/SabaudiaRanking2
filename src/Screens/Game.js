import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";

function GameScreen({ navigation, route }) {
  const gameID = route.params.gameID;
  const [dbInitialized, setDBInitialized] = useState(false);
  const [game, setGame] = useState({
    Date: "",
    Victory: "",
    Scores: {
      Set1: { A: "-", B: "-" },
      Set2: { A: "-", B: "-" },
      Set3: { A: "-", B: "-" },
    },
    TeamA: { player1: { Pseudo: "..." }, player2: { Pseudo: "..." } },
    TeamB: { player1: { Pseudo: "..." }, player2: { Pseudo: "..." } },
    Gain: 0,
    ID: "",
  });

  if (!dbInitialized) {
    const gameRef = ref(db, global.ClubPath + "/games/" + gameID);
    onValue(gameRef, (snapshot) => {
      const g = snapshot.val();
      const newGame = {
        Date: g.Date,
        Victory: g.Victory,
        Scores: g.Scores,
        TeamA: g.TeamA,
        TeamB: g.TeamB,
        Gain: g.Gain,
        ID: g.Key,
      };
      setGame(newGame);
      setDBInitialized(true);
    });
  }

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <View style={Styles.subContainer}>
        <Text style={Styles.boldText}>Equipe A : </Text>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 1 : </Text>
          <Text style={Styles.defaultText}>
            {game.TeamA.player1.Pseudo} {"("}
            {game.TeamA.player1.MMR}
            {" pts)"}
          </Text>
        </View>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 2 : </Text>
          <Text style={Styles.defaultText}>
            {game.TeamA.player2.Pseudo} {"("}
            {game.TeamA.player2.MMR}
            {" pts)"}
          </Text>
        </View>
      </View>

      <View style={Styles.subContainer}>
        <View style={Styles.lineContainer}>
          <Text style={Styles.scoreInput}>{game.Scores.Set1.A}</Text>
          <Text style={Styles.scoreInput}>{game.Scores.Set2.A}</Text>
          <Text style={Styles.scoreInput}>{game.Scores.Set3.A}</Text>
        </View>
        <View style={Styles.lineContainer}>
          <Text style={Styles.scoreInput}>{game.Scores.Set1.B}</Text>
          <Text style={Styles.scoreInput}>{game.Scores.Set2.B}</Text>
          <Text style={Styles.scoreInput}>{game.Scores.Set3.B}</Text>
        </View>
      </View>

      <View style={Styles.subContainer}>
        <Text style={Styles.boldText}>Equipe B : </Text>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 3 : </Text>
          <Text style={Styles.defaultText}>
            {game.TeamB.player1.Pseudo} {"("}
            {game.TeamB.player1.MMR}
            {" pts)"}
          </Text>
        </View>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 4 : </Text>
          <Text style={Styles.defaultText}>
            {game.TeamB.player2.Pseudo} {"("}
            {game.TeamB.player2.MMR}
            {" pts)"}
          </Text>
        </View>
      </View>

      <View style={Styles.subContainer}>
        <Text style={Styles.boldText}>Résultat : </Text>
        <Text style={Styles.defaultText}>
          Victoire de l'équipe {game.Victory}{" "}
        </Text>
        <Text style={Styles.defaultText}>
          Gain de {game.Gain != undefined ? game.Gain : " -?- "}
          {" points"}
        </Text>
      </View>
    </View>
  );
}

export default GameScreen;

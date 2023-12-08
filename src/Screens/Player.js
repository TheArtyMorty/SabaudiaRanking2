import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, Image, ScrollView } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";

function PlayerScreen({ navigation, route }) {
  const playerID = route.params.playerID;

  const [dbInitialized, setDBInitialized] = useState(false);
  const [player, setPlayer] = useState({
    FirstName: "",
    LastName: "",
    MMR: 1234,
    Pseudo: "...",
    Rank: 0,
  });
  const [playerHistory, setplayerHistory] = useState([]);

  const UpdatePlayer = (data) => {
    let newData = [];
    Object.values(data).forEach((player) => {
      newData.push({
        FirstName: player.FirstName,
        LastName: player.LastName,
        ID: player.Key,
        MMR: player.MMR,
        Pseudo: player.Pseudo,
        Rank: 0,
      });
    });

    const actualPlayer = newData
      .sort((a, b) => b.MMR - a.MMR)
      .map((p, index) => {
        var newPlayer = p;
        newPlayer.Rank = index + 1;
        return newPlayer;
      })
      .find((p) => p.ID == playerID);

    setPlayer(actualPlayer);
  };

  const UpdatePlayerGames = (data) => {
    let newData = [];
    Object.values(data).forEach((game) => {
      let newGame = {
        Date: game.Date,
        Victory: game.Victory,
        Scores: game.Scores,
        TeamA: game.TeamA,
        TeamB: game.TeamB,
        Gain: game.Gain,
        IWasOnTeam: "None",
        ID: game.Key,
      };
      if (
        game.TeamA.player1.Key == playerID ||
        game.TeamA.player2.Key == playerID
      ) {
        newGame.IWasOnTeam = "A";
      } else if (
        game.TeamB.player1.Key == playerID ||
        game.TeamB.player2.Key == playerID
      ) {
        newGame.IWasOnTeam = "B";
      }
      newData.push(newGame);
    });

    const actualPlayerGames = newData.filter((g) => {
      return g.IWasOnTeam != "None";
    });

    setplayerHistory(actualPlayerGames);
  };

  if (!dbInitialized) {
    const playersRef = ref(db, global.ClubPath + "/players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      UpdatePlayer(data);
      setDBInitialized(true);
    });

    const gamesRef = ref(db, global.ClubPath + "/games/");
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      UpdatePlayerGames(data);
      setDBInitialized(true);
    });
  }

  const GetPlayerGames = () => {
    return playerHistory
      .sort((a, b) => a.Date - b.Date)
      .map((g, index) => {
        return (
          <View
            style={Styles.playerRankingContainer}
            key={index}
            onTouchEnd={() => {
              console.log(g.ID);
              navigation.navigate("Page de match", { gameID: g.ID });
            }}
          >
            <View style={Styles.lineContainer}>
              <Text style={Styles.boldText}>
                {g.IWasOnTeam == g.Victory ? "Victoire" : "Défaite"}
              </Text>
              <Text style={Styles.defaultText}> </Text>
              <Text style={Styles.defaultText}>
                {(g.IWasOnTeam == g.Victory ? " gagné " : " perdu ") +
                  (g.Gain != undefined ? g.Gain : " -?- ") +
                  "Pts"}
              </Text>
            </View>
          </View>
        );
      });
  };

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <Text style={Styles.boldText}>{player.Pseudo}</Text>
      <Text style={Styles.defaultText}>
        Actuellement classé #{player.Rank} avec {player.MMR} points.
      </Text>
      <Text style={Styles.defaultText}>
        Winrate :{" "}
        {Math.round(
          (playerHistory.filter((g) => g.IWasOnTeam == g.Victory).length /
            playerHistory.length) *
            100
        )}
        {"% "}
        {"("}
        {playerHistory.filter((g) => g.IWasOnTeam == g.Victory).length} sur{" "}
        {playerHistory.length} {")"}.
      </Text>
      <Text style={Styles.defaultText}>Historique des parties : </Text>
      <ScrollView style={Styles.defaultScrollView}>
        {GetPlayerGames()}
      </ScrollView>
    </View>
  );
}

export default PlayerScreen;

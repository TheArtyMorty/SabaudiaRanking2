import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, TextInput, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import { addScore, updatePlayerMMR } from "../Services/WebService.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";
import { defaultPlayer } from "../Services/PlayerUtility.js";

function AddScoreScreen({ navigation }) {
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
        Key: player.Key,
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
    });
  }

  const isSetOfficial = (a, b) => {
    const scoreA = Math.floor(a);
    const scoreB = Math.floor(b);
    return (
      (scoreA == 21 && scoreB < 20) ||
      (scoreB == 21 && scoreA < 20) ||
      (scoreA == 30 && scoreB == 29) ||
      (scoreA == 29 && scoreB == 30) ||
      (scoreA >= 20 &&
        scoreB >= 20 &&
        scoreA <= 30 &&
        scoreB <= 30 &&
        Math.abs(scoreA - scoreB) == 2)
    );
  };

  const isSetValid = (a, b, setNumber) => {
    if (isNaN(a) || isNaN(b)) {
      Alert.alert(
        "Erreur",
        `Erreur : Format de score incorrect pour le set` + setNumber + `...`
      );
      return false;
    }
    const scoreA = Math.floor(a);
    const scoreB = Math.floor(b);

    return scoreA != scoreB;
  };

  const getTeamNote = (p1, p2) => {
    const maxMmr = Math.max(p1.MMR, p2.MMR);
    const minMmr = Math.min(p1.MMR, p2.MMR);
    return Math.round(
      (maxMmr - minMmr) / minMmr >= 0.4
        ? (maxMmr * 1.5 + minMmr) / 2.5
        : (maxMmr + 1.5 * minMmr) / 2.5
    );
  };

  const getMmrGain = (
    player1,
    player2,
    player3,
    player4,
    twosets,
    ptsWinner,
    ptsLooser
  ) => {
    //Notes
    const noteA = getTeamNote(player1, player2);
    const noteB = getTeamNote(player3, player4);
    //Ecart
    const lowMmrMoyen = Math.min(noteA, noteB);
    const topMmrMoyen = Math.max(noteA, noteB);
    const ecart = topMmrMoyen / lowMmrMoyen - 1;
    //proba win
    const probaWl = Math.max(0.1, 0.5 - ecart);
    const probaWt = Math.min(0.9, 0.5 + ecart);
    //gain
    const gain = Math.max(30 * (noteA > noteB ? probaWt : probaWl), 1);
    // bonuses
    const bonus2sets = twosets ? 5 * (noteA > noteB ? probaWl : probaWt) : 0;
    const bonusPts =
      Math.min(Math.floor((ptsWinner - ptsLooser) / ptsLooser / 0.05), 5) *
      (noteA > noteB ? probaWl : probaWt);
    /*console.log("------");
    console.log(noteA);
    console.log(noteB);
    console.log(lowMmrMoyen);
    console.log(topMmrMoyen);
    console.log(ecart);
    console.log(probaWl);
    console.log(probaWt);
    console.log(gain);
    console.log(bonus2sets);
    console.log(bonusPts);*/
    return Math.floor(gain + bonus2sets + bonusPts);
  };

  const validateGame = () => {
    //Check players are properly set
    if (
      player1.Pseudo == "..." ||
      player2.Pseudo == "..." ||
      player3.Pseudo == "..." ||
      player4.Pseudo == "..."
    ) {
      Alert.alert("Erreur", `Erreur : Certains joueurs ne sont pas choisis...`);
      return;
    }
    //Check players are unique
    if (
      player1 == player2 ||
      player1 == player3 ||
      player1 == player4 ||
      player2 == player3 ||
      player2 == player4 ||
      player3 == player4
    ) {
      Alert.alert("Erreur", `Erreur : Des joueurs apparaissent en double...`);
      return;
    }
    // check scores are valid
    let scoreFede = true;
    if (!isSetValid(A1, B1, 1) || !isSetValid(A2, B2, 2)) {
      return;
    }
    if (!isSetOfficial(A1, B1) || !isSetOfficial(A2, B2)) {
      scoreFede = false;
    }

    const a1 = Math.floor(A1);
    const a2 = Math.floor(A2);
    const b1 = Math.floor(B1);
    const b2 = Math.floor(B2);
    let a3 = Math.floor(A3);
    let b3 = Math.floor(B3);
    const v1 = a1 > b1 ? "A" : "B";
    const v2 = a2 > b2 ? "A" : "B";
    let winner;
    if (v1 != v2) {
      if (!isSetValid(A3, B3, 3)) {
        return;
      }
      if (!isSetOfficial(A3, B3)) {
        scoreFede = false;
      }
      winner = a3 > b3 ? "A" : "B";
    } else {
      winner = v1;
      a3 = "-";
      b3 = "-";
    }

    // All is valid
    const scoreA = a1 + a2 + (isNaN(a3) ? 0 : a3);
    const scoreB = b1 + b2 + (isNaN(b3) ? 0 : b3);
    const mmrGain = getMmrGain(
      player1,
      player2,
      player3,
      player4,
      v1 == v2,
      winner == "A" ? scoreA : scoreB,
      winner == "A" ? scoreB : scoreA
    );
    const mmr = winner == "A" ? mmrGain : -mmrGain;

    //alert en cas de match pas fédé
    const invalidMessage = scoreFede
      ? ""
      : "Attention : Au moins un des set n'est pas valide selon la fédé... \n \n";

    Alert.alert(
      "Partie valide",
      invalidMessage +
        "Victoire de l'équipe " +
        winner +
        ".\n L'équipe " +
        winner +
        " va marquer " +
        Math.abs(mmr) +
        " points. \n L'autre équipe va perdre " +
        Math.abs(mmr) +
        " points." +
        "\n Confirmez vous ce résultat ?",
      [
        {
          text: "Non",
          onPress: () => {},
        },
        {
          text: "Oui",
          style: "cancel",
          onPress: () => {
            // log game
            addScore(
              player1,
              player2,
              player3,
              player4,
              winner,
              mmrGain,
              a1,
              a2,
              a3,
              b1,
              b2,
              b3
            );
            //Update mmr
            updatePlayerMMR(player1.Key, player1.MMR + mmr);
            updatePlayerMMR(player2.Key, player2.MMR + mmr);
            updatePlayerMMR(player3.Key, player3.MMR - mmr);
            updatePlayerMMR(player4.Key, player4.MMR - mmr);
            navigation.pop();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const GetPlayerList = () => {
    return playerList.map((p, index) => {
      return <Picker.Item label={p.Pseudo} value={p} key={index} />;
    });
  };

  const [player1, setPlayer1] = useState(defaultPlayer);
  const [player2, setPlayer2] = useState(defaultPlayer);
  const [player3, setPlayer3] = useState(defaultPlayer);
  const [player4, setPlayer4] = useState(defaultPlayer);
  const [A1, setA1] = useState();
  const [A2, setA2] = useState();
  const [A3, setA3] = useState();
  const [B1, setB1] = useState();
  const [B2, setB2] = useState();
  const [B3, setB3] = useState();

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <View style={Styles.subContainer}>
        <Text style={Styles.defaultText}>Equipe A : </Text>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 1 : </Text>
          <Picker
            style={Styles.defaultPicker}
            selectedValue={player1}
            onValueChange={(itemValue, itemIndex) => setPlayer1(itemValue)}
          >
            {GetPlayerList()}
          </Picker>
        </View>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 2 : </Text>
          <Picker
            style={Styles.defaultPicker}
            selectedValue={player2}
            onValueChange={(itemValue, itemIndex) => setPlayer2(itemValue)}
          >
            {GetPlayerList()}
          </Picker>
        </View>
      </View>

      <View style={Styles.subContainer}>
        <View style={Styles.lineContainer}>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setA1(value)}
          ></TextInput>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setA2(value)}
          ></TextInput>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setA3(value)}
          ></TextInput>
        </View>
        <View style={Styles.lineContainer}>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setB1(value)}
          ></TextInput>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setB2(value)}
          ></TextInput>
          <TextInput
            style={Styles.scoreInput}
            keyboardType="numeric"
            placeholder="..."
            onChangeText={(value) => setB3(value)}
          ></TextInput>
        </View>
      </View>

      <View style={Styles.subContainer}>
        <Text style={Styles.defaultText}>Equipe B : </Text>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 3 : </Text>
          <Picker
            style={Styles.defaultPicker}
            selectedValue={player3}
            onValueChange={(itemValue, itemIndex) => setPlayer3(itemValue)}
          >
            {GetPlayerList()}
          </Picker>
        </View>
        <View style={Styles.lineContainer}>
          <Text style={Styles.defaultText}>Joueur 4 : </Text>
          <Picker
            style={Styles.defaultPicker}
            selectedValue={player4}
            onValueChange={(itemValue, itemIndex) => setPlayer4(itemValue)}
          >
            {GetPlayerList()}
          </Picker>
        </View>
      </View>

      <View
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
        onTouchStart={validateGame}
      >
        <View style={Styles.lineContainer}>
          <Image
            style={Styles.defaultImage}
            source={require("../../assets/IconValidate.png")}
          ></Image>
          <Text style={Styles.defaultButtonContent}>Valider la partie</Text>
        </View>
      </View>
    </View>
  );
}

export default AddScoreScreen;

import React, { useState } from "react";
import Styles from "../Styles.js";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../firebaseConfig.js";
import { ref, get, child } from "firebase/database";
import { storeAdmin, storeClub } from "../Services/LocalService.js";
import {
  GetStyle1FromTheme,
  GetStyle2FromTheme,
} from "../Services/ThemeUtility.js";

const getClubs = async () => {
  const dbRef = ref(db);
  return await get(child(dbRef, "Clubs/"));
};

function Club({ navigation, route }) {
  const [dbInitialized, setDBInitialized] = useState(false);
  const [clubList, setClubList] = useState([]);

  if (!dbInitialized) {
    getClubs().then((data) => {
      let newData = [defaultClub];
      Object.values(data.val()).forEach((club) => {
        newData.push({
          Name: club.Name,
          pwd: club.pwd,
          adminpwd: club.adminpwd,
        });
      });

      setClubList((previousData) => newData);
    });
    setDBInitialized(true);
  }

  const GetClubList = () => {
    return clubList.map((c, index) => {
      return <Picker.Item label={c.Name} value={c} key={index} />;
    });
  };

  const defaultClub = {
    Name: "...",
    pwd: "...",
    adminpwd: "...",
  };

  const [club, setclub] = useState(defaultClub);
  const [pwd, setpwd] = useState("");
  const [clubChosen, setclubChosen] = useState(false);
  let navigateBackTriggered = false;

  const NavigateBackIfClubValid = () => {
    if (!clubChosen) {
      alert("Selectionnez le club...");
    } else {
      if (pwd == club.pwd) {
        storeAdmin("false");
        storeClub(club.Name);
        global.ClubPath = club.Name;
        navigateBackTriggered = true;
        route.params.setRefresh();
        navigation.navigate("Acceuil");
        return true;
      } else if (pwd == club.adminpwd) {
        storeAdmin("true");
        storeClub(club.Name);
        global.ClubPath = club.Name;
        navigateBackTriggered = true;
        route.params.setRefresh();
        navigation.navigate("Acceuil");
        return true;
      } else {
        alert("Mot de passe erroné...");
      }
    }
    storeClub("");
    storeAdmin("false");
    return false;
  };

  const ChooseAClub = (club) => {
    if (club.Name != "...") {
      setclub(club);
      setclubChosen(true);
    } else {
      setclub(club);
      setclubChosen(false);
    }
  };

  const ChangePwd = (newpwd) => {
    setpwd(newpwd);
  };

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (navigateBackTriggered) {
          navigation.dispatch(e.data.action);
        }
        e.preventDefault();
        NavigateBackIfClubValid();
      }),
    [navigation, club, clubChosen, pwd, navigateBackTriggered]
  );

  return (
    <View style={[Styles.mainContainer, GetStyle1FromTheme()]}>
      <Text style={Styles.defaultText}>Choisissez votre club :</Text>
      <Picker
        style={Styles.defaultPicker}
        selectedValue={club}
        onValueChange={ChooseAClub}
      >
        {GetClubList()}
      </Picker>
      <TextInput
        style={Styles.defaultInput}
        placeholder="password"
        value={pwd}
        onChangeText={ChangePwd}
      ></TextInput>

      <View
        onTouchStart={NavigateBackIfClubValid}
        style={[Styles.defaultButton, GetStyle2FromTheme()]}
      >
        <Text style={Styles.defaultButtonContent}>Valider</Text>
      </View>
    </View>
  );
}

export default Club;

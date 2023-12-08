import AsyncStorage from "@react-native-async-storage/async-storage";

export const storePlayer = async (value) => {
  await storeKeyValue("Player", value);
};

export const getPlayer = async (value) => {
  return await getKeyValue("Player", value);
};

export const storeClub = async (value) => {
  await storeKeyValue("Club", value);
};

export const getClub = async (value) => {
  return await getKeyValue("Club", value);
};

export const storeAdmin = async (value) => {
  await storeKeyValue("Admin", value);
};

export const getAdmin = async (value) => {
  return await getKeyValue("Admin", value);
};

const storeKeyValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getKeyValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {
      return value;
    }
    return "";
  } catch (e) {
    // error reading value
  }
};

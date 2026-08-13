import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SaveData } from "./types";

const SAVE_KEY = "nine-lives-one-wish/save/v1";

export async function saveGame(data: SaveData): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[save] failed to save", e);
  }
}

export async function loadGame(): Promise<SaveData | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch (e) {
    console.warn("[save] failed to load", e);
    return null;
  }
}

export async function clearSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn("[save] failed to clear", e);
  }
}

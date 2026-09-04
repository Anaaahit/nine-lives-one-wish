import AsyncStorage from "@react-native-async-storage/async-storage";

const BEST_KEY = "bloom/best-score/v1";

export async function loadBest(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(BEST_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function saveBest(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(BEST_KEY, String(score));
  } catch {
    // best-effort only
  }
}

import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useGameStore } from "../store";

const registry: Record<string, number> = {};
const players = new Map<string, ReturnType<typeof createAudioPlayer>>();

export async function initAudio(): Promise<void> {
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "mixWithOthers" });
  } catch (e) {
    console.warn("[audio] init failed", e);
  }
}

export function registerSound(id: string, source: number): void {
  registry[id] = source;
}

export function playSound(id: string): void {
  if (!useGameStore.getState().settings.sound) return;
  const source = registry[id];
  if (!source) return;
  try {
    let player = players.get(id);
    if (!player) {
      player = createAudioPlayer(source);
      players.set(id, player);
    }
    player.seekTo(0).catch(() => undefined);
    player.play();
  } catch (e) {
    console.warn("[sound] playback unavailable", e);
  }
}
